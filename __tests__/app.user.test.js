import request from 'supertest';
import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import matchers from 'jest-supertest-matchers';

import app from '../server';
import User from '../server/entity/User';
import encrypt from '../server/lib/secure.js';

const currUser = {
  email: 'MustafaJohns36@hotmail.com',
  password: 'j1VFGV6z0PQVpQJ',
  firstName: 'Ottilie',
  lastName: 'Pagac',
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

// let userPagehtml;
// let newTaskPagehtml;
// let settingsPagehtml;
// let changePassPagehtml;
// let logoutPagehtml;

describe('Testing responses for Guest', () => {
  let server;

  beforeAll(async () => {
    expect.extend(matchers);
    server = app();
  });

  beforeEach(async () => {
    await server.ready();
  });

  it('should return 200', async () => {
    const res1 = await request.agent(server.server)
      .get('/');
    expect(res1).toHaveHTTPStatus(200);

    const res2 = await request.agent(server.server)
      .get('/session/new');
    expect(res2).toHaveHTTPStatus(200);

    const res3 = await request.agent(server.server)
      .get('/users/new');

    expect(res3).toHaveHTTPStatus(200);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});

describe('Testing responses for User', () => {
  let server;

  beforeAll(async () => {
    // userPagehtml = await fs.readFile(path.join(pathToFixtures, 'user-page.html'));
    // newTaskPagehtml = await fs.readFile(path.join(pathToFixtures, 'newtask-page.html'));
    // settingsPagehtml = await fs.readFile(path.join(pathToFixtures, 'settings-page.html'));
    // changePassPagehtml = await fs.readFile(path.join(pathToFixtures, 'change-pass-page.html'));
    // logoutPagehtml = await fs.readFile(path.join(pathToFixtures, 'logout-page.html'));

    expect.extend(matchers);
    server = app();
    await server.ready();
  });

  // beforeEach(async () => {

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

  it('Should deny registration with exists email', async () => {
    await request.agent(server.server)
      .post('/users')
      .send({ user: currUser })
      .catch((err) => {
        console.log(err);
      });

    const usersFromDb = await User.find();

    expect(usersFromDb.length).toEqual(1);
  });

  it('should return 404', async () => {
    const res = await request.agent(server.server)
      .get('/wrong-path')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    expect(res).toHaveHTTPStatus(404);
  });

  it('Should get new session', async () => {
    const res = await request.agent(server.server)
      .post('/session')
      .send({ object: currUser })
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(302);
  });

  it('Should return page "/users/user"', async () => {
    const res = await request.agent(server.server)
      .get('/users/user')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
    // expect(res.text.toString()).toEqual(userPagehtml.toString());
  });

  it('User should be redirected to "/tasks"', async () => {
    const res = await request.agent(server.server)
      .get('/')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(302);
  });

  it('Should get page "/tasks"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
  });

  it('Should get page "/tasks/new"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/new')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
    // expect(res.text.toString()).toEqual(newTaskPagehtml.toString());
  });

  it('Should get page "/tasks/settings"', async () => {
    const res = await request.agent(server.server)
      .get('/tasks/settings')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(200);
    // expect(res.text.toString()).toEqual(settingsPagehtml.toString());
  });

  it('Should get page for changing password', async () => {
    const res = await request.agent(server.server)
      .get('/users/password')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    expect(res).toHaveHTTPStatus(200);
    // expect(res.text.toString()).toEqual(changePassPagehtml.toString());
  });

  it('Should delete current session', async () => {
    const res = await request.agent(server.server)
      .delete('/session')
      .catch((err) => {
        console.log(err);
      });
    
    expect(res).toHaveHTTPStatus(302);
    // expect(res.text.toString()).toEqual(logoutPagehtml.toString());
  });

  it('Should delete current user', async () => {
    await request.agent(server.server)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ user: currUser })
      .catch((err) => {
        console.log(err);
      });

    const currUserFromDb = await User.findOne({ where: { email: currUser.email } });
    const isCurrUserExistsBeforeDelQuery = currUserFromDb ? true : false;

    await request.agent(server.server)
      .delete('/users/user')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
      });

    const currUserFromDbAfterQuery = await User.findOne({ where: { email: currUser.email } })
    const isCurrUserExistsAfterQuery = currUserFromDbAfterQuery ? true : false;

    expect(isCurrUserExistsBeforeDelQuery).toBe(true);
    expect(isCurrUserExistsAfterQuery).toBe(false);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});
