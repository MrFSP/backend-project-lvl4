import i18next from 'i18next';
import { validate } from 'class-validator';
import User from '../entity/User.js';
import Task from '../entity/Task.js';
import TaskStatus from '../entity/TaskStatus.js';
import Tag from '../entity/Tag.js';
import defaultStatuses from '../configs/statuses.config';
import _ from 'lodash';

const getUsers = async (app) => {
  const usersFromDB = await app.orm
        .getRepository(User)
        .find();
  return usersFromDB.reduce((acc, user) => {
    const value = [user.firstName || '',
      user.lastName || '',
      user.email,
    ].join(' ').replace(/ +/g, ' ').trim();
    user.fullName = value;
    user.passwordDigest = ''
    return { ...acc, [user.id]: user };
  }, {});
};

export const filterTasks = (tasks, filter) => {
  if (!filter) {
    return tasks;
  }
  if (filter.assignedTo) {
    tasks = tasks.filter((task) => {
      if (!task.assignedTo) {
        return false;
      }
      return task.assignedTo === filter.assignedTo
    });
  }
  if (filter.taskStatus) {
    tasks = tasks.filter((task) => task.status === filter.taskStatus);
  }
  if (filter.tag) {
    tasks = tasks.filter((task) => {
      if (!task.tags) {
        return false;
      }
      const taskTags = task.tags;
      return taskTags.find((tag) => tag.id == filter.tag);
    });
  }
  return tasks;
};

export default (app) => {
  app
    .get('/tasks', { name: 'tasks' }, async (req, reply) => {
      const tasks = await app.orm
        .getRepository(Task)
        .createQueryBuilder("task")
        .leftJoinAndSelect("task.tags", "tag")
        .getMany();

      const users = await getUsers(app);

      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const tags = await app.orm.getRepository(Tag).find();

      return reply.render('tasks/index', { tasks, users, taskStatuses, tags });
    })
    .post('/tasks', async (req, reply) => {
      const { filter } = req.body;
      console.log('filterfilter');
      console.log(filter);
      const tasks = await app.orm.getRepository(Task).find({ ...filter });

      // const tasks = filterTasks(allTasks, filter);

      const users = await getUsers(app);

      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const tags = await app.orm.getRepository(Tag).find();

      return reply.render('tasks/index', { tasks, users, taskStatuses, tags });
    })
    .delete('/tasks/:taskId', async (req, reply) => {
      const { taskId } = req.params;
      const task = await app.orm
        .getRepository(Task)
        .findOne(taskId);
      await task.remove();
      return reply.redirect(app.reverse('tasks'));
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const users = await getUsers(app);
      const taskStatuses = await app.orm.getRepository(TaskStatus).find();

      return reply.render(
        'tasks/new',
         { users, taskStatuses },
        );
    })
    .post('/tasks/new', async (req, reply) => {
      const { task, newTags } = req.body;

      const newTagsNames = newTags
        .split(',')
        .map(tagName => tagName.trim());

      const getTags = async (newTagsNames) => {
        await newTagsNames.map(async (tagName) => {
          const tag = new Tag();
          tag.name = tagName;
          await tag.save();
        });

        const tags = newTagsNames.map(async (tagName) => {
          const t = await app.orm.getRepository(Tag).findOne({ name: tagName })
          return t;
        });

        return Promise.all(tags);
      };

      // const tags = newTagsNames
      //   .forEach(async (tagName) => await app.orm.findOne({ name: tagName }));

      // const errors = await tags.map(async (tag) => await validate(tag));
      // if (!_.isEmpty(errors)) {
      //   req.flash('error', i18next.t('flash.tasks.tag.createError'));
      //   return reply.render('/tasks/new');
      // }

      const currentUserId = req.session.get('userId');
      
      const newTask = new Task();
      newTask.name = task.name;
      newTask.status = task.status;
      newTask.description = task.description || '';
      newTask.assignedTo = task.assignedTo || '';
      newTask.creator = currentUserId;
      newTask.tags = await getTags(newTagsNames);

      const errors = await validate(newTask);
      if (!_.isEmpty(errors)) {
        req.flash('error', i18next.t('flash.users.create.error'));
        return reply.render('/users/new', { newTask, errors });
      }

      console.log('newTasknewTask');
      console.log(newTask);

      await Task.save(newTask);
      return reply.redirect(app.reverse('tasks'));
    })
    .get('/tasks/change', { name: 'changeTask' }, async (req, reply) => {
      const { taskId } = req.query;
      const users = await getUsers(app);
      const allTags = await app.orm.getRepository(Tag).find();
      const allTaskStatuses = await app.orm.getRepository(TaskStatus).find();
      
      const task = await app.orm.getRepository(Task).findOne({ id: taskId })

      const namesOfSelectedTags = task.tags.map((t) => t.name)
      const tags = allTags
        .filter((t) => !namesOfSelectedTags.includes(t.name));

      const taskStatuses = allTaskStatuses
        .filter((ts) => ts.name !== task.status)

      return reply.render(
        'tasks/change',
         { users, tags, taskStatuses, task},
        );
    })
    .post('/tasks/change', async (req, reply) => {
      const { task, tagsForTask } = req.body;

      const oldTask = JSON.parse(req.body.oldTask);

      if (!task.name) {
        req.flash('info', i18next.t('flash.tasks.info.empty'));
        return reply.redirect(app.reverse('newTask'));
      }
      
      const taskForChange = await app.orm.getRepository(Task).findOne({ id: oldTask.id });
      taskForChange.tags = taskForChange.tags.filter((tag) => tag === false);
      taskForChange.tags = await getTags(app, tagsForTask);
      taskForChange.name = task.name;
      taskForChange.description = task.description;
      taskForChange.status = task.status;
      taskForChange.assignedTo = task.assignedTo;
      taskForChange.creator = task.creator;
      await taskForChange.save();

      return reply.redirect(app.reverse('tasks'));
    })
    .get('/tasks/settings', { name: 'settings' }, async (req, reply) => {
      const tags = await app.orm.getRepository(Tag).find();
      const allTaskStatuses = await app.orm.getRepository(TaskStatus).find();
      const newTaskStatus = new TaskStatus();
      const newTag = new Tag();
      const couldNotBeDeletedStatuses = [...defaultStatuses];
      const defaultTaskStatuses = allTaskStatuses
        .filter((status) => couldNotBeDeletedStatuses.includes(status.name));
      const taskStatuses = allTaskStatuses
        .filter((status) => !couldNotBeDeletedStatuses.includes(status.name));
      return reply.render(
          'tasks/settings/index',
          {
            tags,
            taskStatuses,
            newTaskStatus,
            newTag,
            defaultTaskStatuses,
          },
        );
    })
    .post('/tasks/settings', async (req, reply) => {
      const { newTag, newTaskStatus } = req.body;

      const trySaveProp = async (value, type) => {
        const prop = type === 'tag' ? Tag : TaskStatus;
      
      const isExists = await app.orm
        .getRepository(prop)
        .findOne({ name: value.name })
        ? true
        : false;
      
        if (isExists) {
          req.flash('error', i18next.t(`flash.tasks.${type}.exists`));
        } else if (!value.name) {
          req.flash('error', i18next.t(`flash.tasks.${type}.empty`));
        } else if (!isExists) {
          req.flash('info', i18next.t(`flash.tasks.${type}.added`));
          await prop.create(value).save();
        }
      };

      newTag ? await trySaveProp(newTag, 'tag') : null;
      newTaskStatus ? await trySaveProp(newTaskStatus, 'status') : null;

      return reply.redirect(app.reverse('settings'));
    })
    .delete('/tasks/settings/:type/:id', async (req, reply) => {
      const { type, id } = req.params;

      const tagId = type === 'tagId' ? id : null;
      const taskStatusId = type === 'taskStatusId' ? id : null;

      if (taskStatusId) {
        await app.orm.getRepository(TaskStatus).remove({ id: taskStatusId });
        req.flash(
          'info',
          i18next.t(`views.tasks.settings.newTaskStatus.success`)
        );
      }

      if (tagId) {
        await app.orm.getRepository(Tag).remove({ id: tagId });
        req.flash('info', i18next.t(`views.tasks.settings.newTag.success`));
      }

      return reply.redirect(app.reverse('settings'));
    });
};
