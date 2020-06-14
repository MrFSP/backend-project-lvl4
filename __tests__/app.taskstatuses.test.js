import request from 'supertest';
import matchers from 'jest-supertest-matchers';
import { promises as fs } from 'fs';
import path from 'path';
import _ from 'lodash';
import faker from 'faker';
import TaskStatus from '../server/entity/TaskStatus';

import app from '../server';

const currUser = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
};

const newTaskStatus = { name: faker.lorem.word() };
const taskStatusForDeleting = { name: faker.lorem.word() };

const getCookie = async (server, user) => {
  const res = await request.agent(server.server)
    .post('/session')
    .send({ object: user })
    .catch((err) => {
      console.log(err);
    });
  return res.header['set-cookie'];
};

describe('Testing task statuses CRUD in app', () => {
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

  it('Should get page "/taskstatuses"', async () => {
    const res = await request.agent(server.server)
      .get('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .catch((err) => {
        console.log(err);
    });

    expect(res).toHaveHTTPStatus(200);
  });

  it('Should set new task status', async () => {
    const successResponse1 = await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: newTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const successResponse2 = await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: newTaskStatus })
      .catch((err) => {
        console.log(err);
      });

    const successResponse3 = await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: { name: '' } })
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();
    const status = await TaskStatus
      .findOne({ where: { name: newTaskStatus.name }});

    expect(successResponse1).toHaveHTTPStatus(302);
    expect(successResponse2).toHaveHTTPStatus(302);
    expect(successResponse3).toHaveHTTPStatus(302);
    expect(statuses.length).toBe(1);
    expect(status.name).toEqual(newTaskStatus.name);
  });

  it('Should delete task status', async () => {
    await request.agent(server.server)
      .post('/taskstatuses')
      .set('cookie', await getCookie(server, currUser))
      .send({ newTaskStatus: taskStatusForDeleting })
      .catch((err) => {
        console.log(err);
      });

    const statusBeforeDeleting = await TaskStatus
      .findOne({ where: { name: taskStatusForDeleting.name } });

    expect(statusBeforeDeleting.name).toEqual(taskStatusForDeleting.name);

    await request.agent(server.server)
      .delete(`/taskstatuses/${statusBeforeDeleting.id}`)
      .set('cookie', await getCookie(server, currUser))
      .send({ taskStatusId: statusBeforeDeleting.id })
      .catch((err) => {
        console.log(err);
      });

    const statuses = await TaskStatus.find();
    const status = await TaskStatus
      .findOne({ where: { name: taskStatusForDeleting.name } });
    
    expect(statuses.length).toBe(1);
    expect(status).toBe(undefined);
  });

  afterAll(async () => {
    await server.close();
    await fs.unlink(path.join(__dirname, 'database.sqlite')).catch(_.noop);
  });

});