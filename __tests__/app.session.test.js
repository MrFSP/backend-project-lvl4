import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import faker from 'faker';
import User from '../server/entity/User';
import Task from '../server/entity/Task';
import encrypt from '../server/lib/secure.js';

import app from '../server';

const currUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const changedUser = {
  email: `changed${currUser.email}`,
  password: `changed${currUser.password}`,
  firstName: `changed${currUser.firstName}`,
  lastName: `changed${currUser.lastName}`,
};

const newTaskStatus = { name: faker.lorem.word() };

const newTask = {
  name: faker.lorem.word(),
  status: newTaskStatus.name,
  description: faker.lorem.text(),
  assignedTo: 1,
};

const tagsForNewTask = `${faker.lorem.word()}, ${faker.lorem.word()}`;

const newTaskWithEmptyName = {
  name: '',
  status: newTask.name,
  description: newTask.description,
};

const newTaskWithEmptyTaskStatus = {
  name: faker.lorem.word(),
  status: '',
  description: newTask.description,
};

const changedNewTask = {
  name: faker.lorem.word(),
  status: newTaskStatus.name,
  description: faker.lorem.text(),
  assignedTo: 1,
};

const tagsForChangedNewTask = `${faker.lorem.word()}, ${faker.lorem.word()}`;

const getCookie = async (server, user) => {
  const res = await request.agent(server.server)
    .post('/session')
    .send({ object: user })
    .catch((err) => {
      console.log(err);
    });
  return res.header['set-cookie'];
};

describe('Testing changes in app', () => {
  let server;

  beforeAll(async () => {
    expect.extend(matchers);
    server = app();
    await server.ready();

    await request.agent(server.server)
    .post('/users')
    .send({ user: currUser })
    .catch((err) => {
      console.log(err);
    });
  });

  beforeEach(async () => {
    await server.ready();
  });

  // afterEach(async () => {

  // });

  it('Should deny creating new session', async () => {
    const res = await request.agent(server.server)
      .post('/session')
      .send({ object: changedUser })
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should create new task', async () => {

    await request.agent(server.server)
      .post('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTask, newTags: tagsForNewTask })
      .catch((err) => {
        console.log(err);
      });

    await request.agent(server.server)
      .post('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTaskWithEmptyName })
      .catch((err) => {
        console.log(err);
      });

    await request.agent(server.server)
      .post('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTaskWithEmptyTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const tasks = await Task.find();
    const taskFromDB = await Task.findOne({ where: { name: newTask.name } });

    expect(taskFromDB.description).toEqual(newTask.description);
    expect(taskFromDB.status).toEqual(newTask.status);
    expect(tasks.length).toBe(1);
  });

  it('Should get page /tasks/:id/edit', async () => {
    const task = await Task.findOne({ where: { name: newTask.name } });

    const res = await request.agent(server.server)
      .get(`/tasks/${task.id}/edit`)
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should change task', async () => {
    const newTaskFromDB = await Task.findOne({ where: { name: newTask.name } });

    await request.agent(server.server)
      .patch(`/tasks/${newTaskFromDB.id}`)
      .set('cookie', await getCookie(server, currUser))
      .send({ task: changedNewTask, newTags: tagsForChangedNewTask })
      .catch((err) => {
        console.log(err);
      });

    const res = await request.agent(server.server)
      .patch(`/tasks/${newTaskFromDB.id}`)
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTaskWithEmptyName })
      .catch((err) => {
        console.log(err);
      });

    const changedTaskFromDB = await Task
      .findOne({ where: { name: changedNewTask.name } });

    expect(changedTaskFromDB.description).toEqual(changedNewTask.description);
    expect(newTaskFromDB.id).toEqual(changedTaskFromDB.id);
    expect(res).toHaveHTTPStatus(302);
  });

  it('Should get filtered task', async () => {
    await request.agent(server.server)
      .post('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTask, newTags: tagsForNewTask })
      .catch((err) => {
        console.log(err);
      });

    const res = await request.agent(server.server)
      .get('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .query({
        filter: {
          status: newTask.status,
          assignedTo: newTask.assignedTo,
          tags: tagsForNewTask
        }
      })
      .catch((err) => {
        console.log(err);
      });

    console.log('resresres');
    console.log(res);

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should not change password', async () => {
    const userFromDbBeforeRequest = await User
      .findOne({ where: { email: currUser.email } });

    const res1 = await request.agent(server.server)
      .post(`/users/${userFromDbBeforeRequest.id}/password`)
      .set('cookie', await getCookie(server, currUser))
      .send({
        object: {
          oldPass: 'wrongPassword',
          newPass: changedUser.password,
          confirmNewPass: changedUser.password,
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const res2 = await request.agent(server.server)
      .post(`/users/${userFromDbBeforeRequest.id}/password`)
      .set('cookie', await getCookie(server, currUser))
      .send({
        object: {
          oldPass: currUser.password,
          newPass: 'newPassword',
          confirmNewPass: 'wrongRepeatedPassword',
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const userFromDbAfterRequest = await User.findOne({ where: { email: currUser.email } });

    expect(userFromDbBeforeRequest.passwordDigest)
      .toEqual(userFromDbAfterRequest.passwordDigest);
    expect(res1).toHaveHTTPStatus(302);
    expect(res2).toHaveHTTPStatus(302);
  });

  it('Should get changed password', async () => {
    const userFromDbBeforeRequest = await User
      .findOne({ where: { email: currUser.email }});

    await request.agent(server.server)
      .post(`/users/${userFromDbBeforeRequest.id}/password`)
      .set('cookie', await getCookie(server, currUser))
      .send({
        object: {
          oldPass: currUser.password,
          newPass: changedUser.password,
          confirmNewPass: changedUser.password,
        }
      })
      .catch((err) => {
        console.log(err);
      });

    await request.agent(server.server)
      .post(`/users/${userFromDbBeforeRequest.id}/password`)
      .set('cookie', await getCookie(server, currUser))
      .send({
        object: {
          oldPass: 'wrongPassword',
          newPass: changedUser.password,
          confirmNewPass: changedUser.password,
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const userFromDbAfterRequest = await User
      .findOne({ where: { email: currUser.email } });

    expect(userFromDbAfterRequest.passwordDigest)
      .toEqual(encrypt(changedUser.password));

    currUser.password = changedUser.password;
  });

  it('user data should be changed', async () => {
    const userFromDbBeforeRequest = await User
      .findOne({ where: { email: currUser.email }});

    await request.agent(server.server)
      .patch(`/users/${userFromDbBeforeRequest.id}`)
      .set('cookie', await getCookie(server, currUser))
      .send({
        user: {
          email: changedUser.email,
          firstName: changedUser.firstName,
          lastName:changedUser.lastName,
        }
      })
      .catch((err) => {
        console.log(err);
      });

    const userFromDbAfterRequest = await User
      .findOne({ where: { email: changedUser.email } });

    expect(userFromDbAfterRequest.firstName).toEqual(changedUser.firstName);
    expect(userFromDbAfterRequest.lastName).toEqual(changedUser.lastName);
  });

  it('Should delete task', async () => {
    const taskForDeleting = {
      name: `taskForDeleting${newTask.name}`,
      status: `taskForDeleting${newTask.status}`,
      description: `taskForDeleting${newTask.description}`,
    }

    await request.agent(server.server)
      .post('/tasks')
      .set('cookie', await getCookie(server, changedUser))
      .send({ task: taskForDeleting })
      .catch((err) => {
        console.log(err);
      });

    const taskForDeletingFromDb = await Task.findOne({ where: { name: taskForDeleting.name } });
    const isTaskForDeletingExistsBeforeDelQuery = taskForDeletingFromDb
      ? true
      : false;

    await request.agent(server.server)
      .delete(`/tasks/${taskForDeletingFromDb.id}`)
      .set('cookie', await getCookie(server, changedUser))
      .catch((err) => {
        console.log(err);
      });

    const taskForDeletingFromDbAfterQuery = await Task.findOne({ where: { name: taskForDeleting.name } })
    const isTaskForDeletingExistsAfterQuery = taskForDeletingFromDbAfterQuery 
      ? true
      : false;

    expect(isTaskForDeletingExistsBeforeDelQuery).toBe(true);
    expect(isTaskForDeletingExistsAfterQuery).toBe(false);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});