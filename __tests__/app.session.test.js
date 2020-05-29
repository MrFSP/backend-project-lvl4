import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
// import faker from 'faker';
import User from '../server/entity/User';
import Task from '../server/entity/Task';
import TaskStatus from '../server/entity/TaskStatus';
import Tag from '../server/entity/Tag';
import encrypt from '../server/lib/secure.js';

import app from '../server';

const currUser = {
  email: 'MustafaJohns36@hotmail.com',
  password: 'j1VFGV6z0PQVpQJ',
  firstName: 'Ottilie',
  lastName: 'Pagac',
};

const changedUser = {
  email: `changed${currUser.email}`,
  password: `changed${currUser.password}`,
  firstName: `changed${currUser.firstName}`,
  lastName: `changed${currUser.lastName}`,
};

const newTag = { name: 'Main' };
const newTaskStatus = { name: 'tests' };
const anotherTaskStatus = {name: 'filtered status'};

const newTask = {
  name: 'quaerat',
  status: newTaskStatus.name,
  description: 'Libero deleniti eum recusandae repudiandae cupiditate aut. Tenetur ea vel. Ad asperiores sequi ut ex qui aut rem aspernatur.',
};

const newTaskWithEmptyName = {
  name: '',
  status: newTask.name,
  description: newTask.description,
};

const anotherNewTask = {
  name: `another ${newTask.name}`,
  status: anotherTaskStatus.name,
  description: `another ${newTask.description}`,
  assignedTo: 1,
  creator: 1,
};

const changedNewTask = {
  name: 'changedquaerat',
  status: newTaskStatus.name,
  description: 'Changed Libero deleniti eum recusandae repudiandae cupiditate aut. Tenetur ea vel. Ad asperiores sequi ut ex qui aut rem aspernatur.',
};

const getCookie = async (server, user) => {
  const res = await request.agent(server.server)
    .post('/session')
    .send({ object: user })
    .catch((err) => {
      console.log(err);
    });
  return res.header['set-cookie'];
};

const pathToFixtures = path.join(__dirname, '__fixtures__');


// let afterSignInPagehtml;
// let changeTaskPagehtml;
let filteredTaskPagehtml;

describe('Testing changes in app', () => {
  let server;

  beforeAll(async () => {
    // afterSignInPagehtml = await fs.readFile(path.join(pathToFixtures, 'after-sign-in-page.html'));
    // changeTaskPagehtml = await fs.readFile(path.join(pathToFixtures, 'change-task-page.html'));
    filteredTaskPagehtml = await fs.readFile(path.join(pathToFixtures, 'filtered-task-page.html'));

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

  it('Should set new tag', async () => {
    const successResponse1 = await request.agent(server.server)
      .post('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTag: newTag })
      .catch((err) => {
        console.log(err);
      });

    const successResponse2 = await request.agent(server.server)
      .post('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTag: newTag })
      .catch((err) => {
        console.log(err);
      });

    const successResponse3 = await request.agent(server.server)
      .post('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTag: { name: '' } })
      .catch((err) => {
        console.log(err);
      });

    const tags = await Tag.find();
    const tag = await Tag.findOne({ where: { name: newTag.name } });

    expect(successResponse1).toHaveHTTPStatus(302);
    expect(successResponse2).toHaveHTTPStatus(302);
    expect(successResponse3).toHaveHTTPStatus(302);
    expect(tags.length).toBe(1);
    expect(tag.name).toEqual(newTag.name);
  });

  it('Should set new task status', async () => {
    const successResponse1 = await request.agent(server.server)
      .post('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: newTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const successResponse2 = await request.agent(server.server)
      .post('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: newTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const successResponse3 = await request.agent(server.server)
      .post('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: { name: '' } })
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();
    const status = await TaskStatus.findOne({ where: { name: newTaskStatus.name } });

    expect(successResponse1).toHaveHTTPStatus(302);
    expect(successResponse2).toHaveHTTPStatus(302);
    expect(successResponse3).toHaveHTTPStatus(302);
    expect(statuses.length).toBe(1);
    expect(status.name).toEqual(newTaskStatus.name);
  });

  it('Should create new task', async () => {

    await request.agent(server.server)
      .post('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTask, tagsForTask: newTag })
      .catch((err) => {
        console.log(err);
      });

    await request.agent(server.server)
      .post('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTaskWithEmptyName, tagsForTask: newTag })
      .catch((err) => {
        console.log(err);
      });

    const tasks = await Task.find();
    const taskFromDB = await Task.findOne({ where: { name: newTask.name } });

    expect(taskFromDB.description).toEqual(newTask.description);
    expect(taskFromDB.status).toEqual(newTask.status);
    expect(tasks.length).toBe(1);
  });

  it('Should get page /tasks/change', async () => {
    const task = await Task.findOne({ where: { name: newTask.name } });

    const res = await request.agent(server.server)
      .get(`/tasks/change?taskId=${task.id}`)
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
    // expect(res.text.toString()).toEqual(changeTaskPagehtml.toString());
  });

  it('Should change task', async () => {
    const newTaskFromDB = await Task.findOne({ where: { name: newTask.name } });

    await request.agent(server.server)
      .post('/tasks/change')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: changedNewTask, oldTask: JSON.stringify(newTaskFromDB) })
      .catch((err) => {
        console.log(err);
      });

    const res = await request.agent(server.server)
      .post('/tasks/change')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTaskWithEmptyName, oldTask: JSON.stringify(newTaskFromDB) })
      .catch((err) => {
        console.log(err);
      });

    const changedTaskFromDB = await Task.findOne({ where: { name: changedNewTask.name } });

    expect(changedTaskFromDB.description).toEqual(changedNewTask.description);
    expect(newTaskFromDB.id).toEqual(changedTaskFromDB.id);
    expect(res).toHaveHTTPStatus(302);
  });

  it('Should get filtered task', async () => {
    await request.agent(server.server)
      .post('/tasks/settings')
      .send({ newTaskStatus: anotherTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    await request.agent(server.server)
      .post('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: anotherNewTask })
      .catch((err) => {
        console.log(err);
      });

    const res = await request.agent(server.server)
      .post('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .send({ filter: { taskStatus: 'filtered status' } })
      .catch((err) => {
        console.log(err);
      });

    expect(res.text.toString()).toEqual(filteredTaskPagehtml.toString());
  });

  it('Should get changed password', async () => {
    await request.agent(server.server)
      .post('/users/password')
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

    const userFromDb = await User.findOne({ where: { email: currUser.email } });

    expect(userFromDb.passwordDigest).toEqual(encrypt(changedUser.password));

    currUser.password = changedUser.password;
  });

  it('user data should be changed', async () => {

    await request.agent(server.server)
      .post('/users/user')
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

    const userFromDb = await User.findOne({ where: { email: changedUser.email } });

    expect(userFromDb.firstName).toEqual(changedUser.firstName);
    expect(userFromDb.lastName).toEqual(changedUser.lastName);
  });

  it('Should delete task', async () => {
    const taskForDeleting = {
      name: `taskForDeleting${newTask.name}`,
      status: `taskForDeleting${newTask.status}`,
      description: `taskForDeleting${newTask.description}`,
    }

    await request.agent(server.server)
    .post('/tasks/new')
    .set('cookie', await getCookie(server, changedUser))
    .send({ task: taskForDeleting })
    .catch((err) => {
      console.log(err);
    });

    const taskForDeletingFromDb = await Task.findOne({ where: { name: taskForDeleting.name } });
    const isTaskForDeletingExistsBeforeDelQuery = taskForDeletingFromDb ? true : false;

    await request.agent(server.server)
      .delete('/tasks')
      .set('cookie', await getCookie(server, changedUser))
      .send({ taskID: taskForDeletingFromDb.id })
      .catch((err) => {
        console.log(err);
      });

    const taskForDeletingFromDbAfterQuery = await Task.findOne({ where: { name: taskForDeleting.name } })
    const isTaskForDeletingExistsAfterQuery = taskForDeletingFromDbAfterQuery ? true : false;

    expect(isTaskForDeletingExistsBeforeDelQuery).toBe(true);
    expect(isTaskForDeletingExistsAfterQuery).toBe(false);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});