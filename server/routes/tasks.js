import i18next from 'i18next';
import { validate } from 'class-validator';
import User from '../entity/User.js';
import Task from '../entity/Task.js';
import TaskStatus from '../entity/TaskStatus.js';
import Tag from '../entity/Tag.js';
import _ from 'lodash';

const getTags = async (app, newTags) => {
  if (!newTags) {
    return;
  }
  const tags = await _.words(newTags)
    .map(tagName => _.capitalize(tagName))
    .map(async (tagName) => {
      const tag = new Tag();
      tag.name = tagName;
      await app.orm
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values(tag)
        .onConflict('("name") DO UPDATE SET "name" = :name')
        .setParameter("name", tag.name)
        .execute();

      return tag;
    });

    return Promise.all(tags)
};

const filterTasks = async (app, filter) => {

  const getTagsNames = (tagsNames) => _.words(tagsNames).map(tagName => _.capitalize(tagName));

  const query = [
    filter.status ? 'task.status = :status' : null,
    filter.assignedTo ? 'task.assignedTo = :assignedTo' : null,
    filter.tags ? 'tag.name in (:...tagsNames)' : null
  ].filter((item) => item !== null)
    .join(' AND ');

  const tasks = await app.orm
    .createQueryBuilder(Task, 'task')
    .leftJoinAndSelect('task.tags', 'tag')
    .leftJoinAndSelect('task.creator', 'tasksCreator')
    .leftJoinAndSelect('task.assignedTo', 'tasksExecutor')
    .where(
      query,
      {
        status: filter.status,
        assignedTo: filter.assignedTo,
        tagsNames: filter.tags ? getTagsNames(filter.tags) : null,
      }
    )
    .getMany();

  return tasks;
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks#index' }, async (req, reply) => {
      const filter = { ...req.query };

      const tasks = !_.isEmpty(filter)
        ? await filterTasks(app, filter)
        : await app.orm.getRepository(Task).find();

      const users = await app.orm.getRepository(User).find();

      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const tags = await app.orm.getRepository(Tag).find();

      return reply.render('tasks/index', { tasks, users, taskStatuses, tags });
    })
    .get('/tasks/new', { name: 'tasks#new' }, async (req, reply) => {
      const users = await app.orm.getRepository(User).find();
      const taskStatuses = await app.orm.getRepository(TaskStatus).find();

      return reply.render(
        'tasks/new',
         { users, taskStatuses },
        );
    })
    .post('/tasks', { name: 'tasks#create' }, async (req, reply) => {
      const { task, newTags } = req.body;

      const currentUserId = req.session.get('userId');
      
      const newTask = new Task();
      newTask.tags = await getTags(app, newTags);
      newTask.name = task.name;
      newTask.status = task.status;
      newTask.description = task.description || '';
      newTask.assignedTo = task.assignedTo || null;
      newTask.creator = currentUserId;

      const errors = await validate(newTask);
      if (!_.isEmpty(errors)) {
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const users = await app.orm.getRepository(User).find();
        const taskStatuses = await app.orm.getRepository(TaskStatus).find();
        return reply.render('/tasks/new', { users, taskStatuses, errors });
      }

      await newTask.save();
      return reply.redirect(app.reverse('tasks#index'));
    })
    .get('/tasks/:id/edit', { name: 'tasks#edit' }, async (req, reply) => {
      const taskId = req.params.id;
      const users = await app.orm.getRepository(User).find();
      const allTaskStatuses = await app.orm.getRepository(TaskStatus).find();
      
      const task = await app.orm.getRepository(Task).findOne({ id: taskId })

      const taskStatuses = allTaskStatuses.filter((ts) => ts.name !== task.status)

      return reply.render(
        'tasks/change',
         { users, taskStatuses, task },
        );
    })
    .patch('/tasks/:id', { name: 'tasks#update' }, async (req, reply) => {
      const taskId = req.params.id;
      const { task, newTags } = req.body;

      if (!task.name) {
        req.flash('info', i18next.t('flash.tasks.info.empty'));
        return reply.redirect(`/tasks/${taskId}/edit`);
      }
      
      const taskForChange = await app.orm
        .getRepository(Task)
        .findOne({ id: taskId });

      taskForChange.tags = await getTags(app, newTags);
      taskForChange.name = task.name;
      taskForChange.description = task.description;
      taskForChange.status = task.status;
      taskForChange.assignedTo = task.assignedTo;
      taskForChange.creator = task.creator;

      await taskForChange.save();

      return reply.redirect(app.reverse('tasks#index'));
    })
    .delete('/tasks/:id', { name: 'tasks#destroy' }, async (req, reply) => {
      const taskId = req.params.id;
      const task = await app.orm
        .getRepository(Task)
        .findOne(taskId);
      await task.remove();
      return reply.redirect(app.reverse('tasks#index'));
    })
};
