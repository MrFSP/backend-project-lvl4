// @ts-check

import i18next from 'i18next';
import User from '../entity/User.js';
import Task from '../entity/Task.js';
import TaskStatus from '../entity/TaskStatus.js';
import Tag from '../entity/Tag.js';

const getUsers = async (app) => {
  const usersFromDB = await app.orm
        .getRepository(User)
        .find();
  return usersFromDB.reduce((acc, user) => {
    const value = [user.firstName || '',
      user.LastName || '',
      user.email,
    ].join(' ').replace(/ +/g, ' ').trim();
    user.fullName = value;
    user.passwordDigest = ''
    return { ...acc, [user.id]: user };
  }, {});
};

const filterTasks = (tasks, filter) => {
  if (!filter) {
    return tasks;
  }
  if (filter.assignedTo) {
    tasks = tasks.filter((task) => task.assignedTo === filter.assignedTo);
  }
  if (filter.taskStatus) {
    tasks = tasks.filter((task) => task.status === filter.taskStatus);
  }
  if (filter.tag) {
    tasks = tasks.filter((task) => {
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
      const allTasks = await app.orm
        .getRepository(Task)
        .createQueryBuilder("task")
        .leftJoinAndSelect("task.tags", "tag")
        .getMany();

      const tasks = filterTasks(allTasks, filter);

      const users = await getUsers(app);

      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const tags = await app.orm.getRepository(Tag).find();

      return reply.render('tasks/index', { tasks, users, taskStatuses, tags });
    })
    .delete('/tasks', async (req, reply) => {
      const { taskID } = req.body;
      await app.orm
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where("id = :id", { id: taskID })
        .execute();
      return reply.redirect(app.reverse('tasks'));
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const users = await app.orm.getRepository(User).find();
      const tags = await app.orm.getRepository(Tag).find();
      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const task = new Task();
      const taskStatus = new TaskStatus();
      const tag = new Tag();

      return reply.render(
        'tasks/new',
         { users, tags, taskStatuses, task, taskStatus, tag },
        );
    })
    .post('/tasks/new', async (req, reply) => {
      const { task, tagsForTask } = req.body;
      if (!task.name) {
        req.flash('info', i18next.t('Введите название задачи'));
        return reply.redirect(app.reverse('newTask'));
      }
      const currentUserId = req.session.get('userId');
      const tagsNames = tagsForTask ? tagsForTask.name : null;
      let tags;
      if (Array.isArray(tagsNames)) {
        tags = tagsNames.map(async (name) => {
          const tag = await app.orm
            .getRepository(Tag)
            .findOne({ name: name });
          return tag;
        });
      } else if (tagsNames) {
        const tag = await app.orm
        .getRepository(Tag)
        .findOne({ name: tagsNames });
        tags = [tag];
      }

      const newTask = new Task();
      newTask.name = task.name;
      newTask.status = task.status;
      newTask.description = task.description || '';
      newTask.assignedTo = task.assignedTo || '';
      newTask.creator = currentUserId;

      try {
        newTask.tags = tagsNames ? await Promise.all(tags) : null;
        await Task.save(newTask);
        return reply.redirect(app.reverse('tasks'));
      } catch (err) {
        console.log(err);
      }

    })
    .get('/tasks/change', { name: 'changeTask' }, async (req, reply) => {
      const { taskId } = req.query;
      const users = await app.orm.getRepository(User).find();
      const tags = await app.orm.getRepository(Tag).find();
      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const task = await app.orm.getRepository(Task).findOne({ id: taskId })
      return reply.render(
        'tasks/change',
         { users, tags, taskStatuses, task},
        );
    })
    .post('/tasks/change', async (req, reply) => {
      const { task } = req.body;

      const oldTask = JSON.parse(req.body.oldTask);

      if (!task.name) {
        req.flash('info', i18next.t('Введите название задачи'));
        return reply.redirect(app.reverse('newTask'));
      }
      const currentUserId = req.session.get('userId');

      try {
        await app.orm
          .createQueryBuilder()
          .update(Task)
          .set({
            name: task.name,
            description: task.description || '',
            status: task.status,
            assignedTo: task.assignedTo || '',
            creator: currentUserId,
          })
          .where("id = :id", { id: oldTask.id })
          .execute();
        return reply.redirect(app.reverse('tasks'));
      } catch (err) {
        console.log(err);
      }
    })
    .get('/tasks/settings', { name: 'settings' }, async (req, reply) => {
      const tags = await app.orm.getRepository(Tag).find();
      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const newTaskStatus = new TaskStatus();
      const newTag = new Tag();
      return reply.render(
          'tasks/settings/index',
          { tags, taskStatuses, newTaskStatus, newTag },
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
          await prop.create(value).save();
          req.flash('info', i18next.t(`flash.tasks.${type}.added`));
        } else {
          req.flash('error', i18next.t(`flash.tasks.error`));
        }
      };

      newTag ? await trySaveProp(newTag, 'tag') : null;
      newTaskStatus ? await trySaveProp(newTaskStatus, 'status') : null;

      return reply.redirect(app.reverse('settings'));
    });
};
