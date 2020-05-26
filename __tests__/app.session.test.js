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