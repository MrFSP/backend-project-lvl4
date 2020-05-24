// @ts-check

import i18next from 'i18next';
import { validate } from 'class-validator';
import _ from 'lodash';
import encrypt from '../lib/secure.js';
import User from '../entity/User.js';
import Task from '../entity/Task.js';
import TaskStatus from '../entity/TaskStatus.js';
import Tag from '../entity/Tag.js';
import { access } from 'fs';
// import { buildFromObj, buildFromModel } from '../lib/formObjectBuilder';

export default (app) => {
  app
    .get('/tasks/index', { name: 'tasks' }, async (req, reply) => {
      const userId = req.session.get('userId');
      // const tasks = await app.orm.getRepository(Task).find();
      
      const tasks = await app.orm
        .getRepository(Task)
        .createQueryBuilder("task")
        .leftJoinAndSelect("task.tags", "tag")
        .getMany();
      // console.log(tasks);
      const usersFromDB = await app.orm
        .getRepository(User)
        .find();
      const users = usersFromDB.reduce((acc, user) => {
          const key = `${user.id}`;
          const value = [user.firstName || '',
            user.LastName || '',
            user.email,
          ].join(' ').replace(/ +/g, ' ').trim();
          return { ...acc, [key]: value };
        }, {});

      console.log(users);

      return reply.render('tasks/index', { tasks, users });
    })
    .get('/tasks/new', { name: 'newTask' }, async (req, reply) => {
      const userId = req.session.get('userId');
      console.log(userId);
      const users = await app.orm.getRepository(User).find();
      const tags = await app.orm.getRepository(Tag).find();
      const taskStatuses = await app.orm.getRepository(TaskStatus).find();
      const task = new Task();
      const taskStatus = new TaskStatus();
      const tag = new Tag();
      console.log(task);

      return reply.render(
        'tasks/new',
         { users, tags, taskStatuses, task, taskStatus, tag },
        );
    })
    .post('/tasks/new', { name: 'newTaskPost' }, async (req, reply) => {
      // console.log(req.body);
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

      console.log('newTask');
      console.log(newTask);

      try {
        newTask.tags = tagsNames ? await Promise.all(tags) : null;
        await Task.save(newTask);
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
    .post('/tasks/settings/addTag', { name: 'addTag' }, async (req, reply) => {
      const { newTag } = req.body;
      const isTagExists = await app.orm
        .getRepository(Tag)
        .findOne({ name: newTag.name })
        ? true
        : false;

      if (isTagExists) {
        req.flash('error', i18next.t('Тег с таким именем уже существует'));
      } else if (!newTag.name) {
        req.flash('error', i18next.t('Введите имя тега'));
      } else if (!isTagExists) {
        await Tag.create(newTag).save();
        req.flash('info', i18next.t('Тег добавлен'));
      } else {
        req.flash('error', i18next.t('Непредвиденная ошибка'));
      }
      return reply.redirect(app.reverse('settings'));
    })
    .post('/tasks/settings/addTaskStatus', { name: 'addTaskStatus' }, async (req, reply) => {
      const { newTaskStatus } = req.body;
      const isTaskStatusExists = await app.orm
        .getRepository(TaskStatus)
        .findOne({ name: newTaskStatus.name })
        ? true
        : false;

      if (isTaskStatusExists) {
        req.flash('error', i18next.t('Статус с таким именем уже существует'));
      } else if (!newTaskStatus.name) {
        req.flash('error', i18next.t('Введите имя статуса'));
      } else if (!isTaskStatusExists) {
        await TaskStatus.create(newTaskStatus).save();
        req.flash('info', i18next.t('Статус добавлен'));
      } else {
        req.flash('error', i18next.t('Непредвиденная ошибка'));
      }
      return reply.redirect(app.reverse('settings'));
    })
    .post('/tasks/index', { name: 'deleteTask'}, async (req, reply) => {
      console.log('bodybody');
      console.log(req.body);
      const taskID = req.body.taskID;
      await app.orm
        .createQueryBuilder()
        .delete()
        .from(Task)
        .where("id = :id", { id: taskID })
        .execute();
      return reply.redirect(app.reverse('tasks'));
    });
};
