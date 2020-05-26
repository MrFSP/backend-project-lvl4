import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { promises as fs } from 'fs';
import path from 'path';
import faker from 'faker';
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

const newTask = {
  name: 'quaerat',
  status: newTaskStatus.name,
  description: 'Libero deleniti eum recusandae repudiandae cupiditate aut. Tenetur ea vel. Ad asperiores sequi ut ex qui aut rem aspernatur.',
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

let logoutPagehtml;
let settingsPagehtml;
let afterSignInPagehtml;
let userPagehtml;
let newTaskPagehtml;
let changePassPagehtml;
let changeTaskPagehtml;
let cookie;

describe('Testing session for registered user', () => {
  let server;

  beforeAll(async () => {
    logoutPagehtml = await fs.readFile(path.join(pathToFixtures, 'logout-page.html'));
    settingsPagehtml = await fs.readFile(path.join(pathToFixtures, 'settings-page.html'));
    afterSignInPagehtml = await fs.readFile(path.join(pathToFixtures, 'after-sign-in-page.html'));
    userPagehtml = await fs.readFile(path.join(pathToFixtures, 'user-page.html'));
    newTaskPagehtml = await fs.readFile(path.join(pathToFixtures, 'newtask-page.html'));
    changePassPagehtml = await fs.readFile(path.join(pathToFixtures, 'change-pass-page.html'));
    changeTaskPagehtml = await fs.readFile(path.join(pathToFixtures, 'change-task-page.html'));

    expect.extend(matchers);
    server = app();
    await server.ready();
  });

  beforeEach(async () => {
    // await server.ready();
  });

  // afterEach(async () => {

  // });

  it('User should be registered', async () => {
    await request.agent(server.server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ user: currUser })
      .catch((err) => {
        console.log(err);
      });

    const userFromDb = await User.findOne({ where: { email: currUser.email } });

    expect(userFromDb.email).toEqual(currUser.email);
    expect(userFromDb.passwordDigest).toEqual(encrypt(currUser.password));
  });

  it('Should get new session', async () => {
    const res = await request.agent(server.server)
      .post('/session')
      .send({ object: currUser })
      .redirects(2)
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(afterSignInPagehtml.toString());
  });

  it('Should return current session', async () => {
    const res = await request.agent(server.server)
      .get('/users/user')
      .set('cookie', await getCookie(server, currUser))
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(userPagehtml.toString());
  });

  it('Should get page "/tasks/new"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(newTaskPagehtml.toString());
  });

  it('Should set new tag', async () => {
    const successResponse1 = await request.agent(server.server)
      .post('/tasks/settings/addtag')
      .send({ newTag: newTag })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const successResponse2 = await request.agent(server.server)
      .post('/tasks/settings/addtag')
      .send({ newTag: newTag })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const successResponse3 = await request.agent(server.server)
      .post('/tasks/settings/addtag')
      .send({ newTag: { name: '' } })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const tags = await Tag.find();
    const tag = await Tag.findOne({ where: { name: newTag.name } });

    expect(successResponse1).toHaveHTTPStatus(200);
    expect(successResponse2).toHaveHTTPStatus(200);
    expect(successResponse3).toHaveHTTPStatus(200);
    expect(tags.length).toBe(1);
    expect(tag.name).toEqual(newTag.name);
  });

  it('Should set new task status', async () => {
    const successResponse1 = await request.agent(server.server)
      .post('/tasks/settings/addtaskstatus')
      .send({ newTaskStatus: newTaskStatus })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const successResponse2 = await request.agent(server.server)
      .post('/tasks/settings/addtaskstatus')
      .send({ newTaskStatus: newTaskStatus })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const successResponse3 = await request.agent(server.server)
      .post('/tasks/settings/addtaskstatus')
      .send({ newTaskStatus: { name: '' } })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();
    const status = await TaskStatus.findOne({ where: { name: newTaskStatus.name } });

    expect(successResponse1).toHaveHTTPStatus(200);
    expect(successResponse2).toHaveHTTPStatus(200);
    expect(successResponse3).toHaveHTTPStatus(200);
    expect(statuses.length).toBe(1);
    expect(status.name).toEqual(newTaskStatus.name);
  });

  it('Should get page "/tasks/settings"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(settingsPagehtml.toString());
  });

  it('Should create new task', async () => {
    await request.agent(server.server)
      .post('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: newTask, tagsForTask: newTag })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    const taskFromDB = await Task.findOne({ where: { name: newTask.name } });

    expect(taskFromDB.description).toEqual(newTask.description);
    expect(taskFromDB.status).toEqual(newTask.status);
  });

  it('Should get page /tasks/change', async () => {
    const res = await request.agent(server.server)
      .post('/tasks/change')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: JSON.stringify(newTask) })
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });

    expect(res.text.toString()).toEqual(changeTaskPagehtml.toString());
  });

  it('Should change task', async () => {
    const newTaskFromDB = await Task.findOne({ where: { name: newTask.name } });

    await request.agent(server.server)
      .post('/tasks/changecomplete')
      .set('cookie', await getCookie(server, currUser))
      .send({ task: changedNewTask, oldTask: JSON.stringify(newTaskFromDB) })
      .catch((err) => {
        console.log(err);
      });

    const changedTaskFromDB = await Task.findOne({ where: { name: changedNewTask.name } });

    expect(changedTaskFromDB.description).toEqual(changedNewTask.description);
    expect(newTaskFromDB.id).toEqual(changedTaskFromDB.id);
  });

  it('Should get page for changing password', async () => {
    const res = await request.agent(server.server)
      .get('/users/password')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(changePassPagehtml.toString());
  });

  it('Should get changed password', async () => {
    await request.agent(server.server)
      .post('/users/password/index')
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

  it('Should delete current session', async () => {
    const res = await request.agent(server.server)
      .delete('/session')
      .redirects(1)
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
    expect(res.text.toString()).toEqual(logoutPagehtml.toString());
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite'));
  });

});