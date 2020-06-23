// @ts-check

import i18next from 'i18next';
import { validate } from 'class-validator';
import _ from 'lodash';
import encrypt from '../lib/secure.js';
import User from '../entity/User.js';
// import { buildFromObj, buildFromModel } from '../lib/formObjectBuilder';

export default (app) => {
  app
    .get('/users', { name: 'users#index' }, async (req, reply) => {
      const users = await app.orm.getRepository(User).find();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'users#new' }, async (req, reply) => {
      const user = new User();
      reply.render('users/new', { user });
      return reply;
    })
    .post('/users', { name: 'users#create' }, async (req, reply) => {
      const user = User.create(req.body.user);
      const password = req.body.user.password;
      user.passwordDigest = encrypt(password);
      user.tasksCreator = null;
      user.tasksExecutor = null;

      const errors = await validate(user);
      if (!_.isEmpty(errors)) {
        req.flash('error', i18next.t('flash.users.create.error'));
        return reply.render('/users/new', { user, errors });
      }

      await user.save();
      req.flash('info', i18next.t('flash.users.create.success'));
      return reply.redirect(app.reverse('newSession'));
    })
    .get('/users/:id/edit', { name: 'users#edit' }, async (req, reply) => {
      const userId = req.params.id;

      const user = await app.orm
        .getRepository(User)
        .findOne(userId);

      const keys = Object.keys(user)
        .filter((key) => ![
          'passwordDigest',
          'tasksCreator',
          'tasksExecutor',
          'id'].includes(key));

      return reply.render('users/user', { user, keys });
    })
    .patch('/users/:id', { name: 'users#update' }, async (req, reply) => {
      const userId = req.params.id;
      const { user } = req.body;

      await app.orm
        .createQueryBuilder()
        .update(User)
        .set({ 
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        })
        .where("id = :id", { id: userId })
        .execute();

      req.flash('info', i18next.t('views.user.accountUpdated'));
      return reply.redirect(`/users/${userId}/edit`);
    })
    .delete('/users/:id', { name: 'users#destroy' }, async (req, reply) => {
      const id = req.params.id;
      const user = await app.orm
        .getRepository(User)
        .findOne(id);
      await user.remove();
      req.session.delete();
      req.flash('info', i18next.t('views.user.accountDeleted'));
      return reply.redirect(app.reverse('root'));
    })
    .get(
      '/users/:id/password',
      { name: 'users/password#update' },
      async (req, reply) => {
        const pass = {
          oldPass: '',
          newPass: '',
          confirmNewPass: '',
        }
        const passKeys = Object.keys(pass)
        return reply.render('users/password/index', { pass, passKeys });
      }
    )
    .post('/users/:id/password', async (req, reply) => {
      const userId = req.params.id;
      const pass = req.body.object;
      const user = await app.orm
        .getRepository(User)
        .findOne(userId);
      const isCorrectOldPassword = encrypt(pass.oldPass) === user.passwordDigest;
      if (!isCorrectOldPassword) {
        req.flash('error', i18next.t('flash.users.create.wrongOldPass'));
        return reply.redirect(`/users/${userId}/password`);
      }
      const isCorrectRepeatedPassword = pass.newPass === pass.confirmNewPass;
      if (!isCorrectRepeatedPassword) {
        req.flash('error', i18next.t('flash.users.create.wrongConfirmation'));
        return reply.redirect(`/users/${userId}/password`);
      }

      await app.orm
      .createQueryBuilder()
      .update(User)
      .set({ 
        passwordDigest: encrypt(pass.newPass),
      })
      .where("id = :id", { id: userId })
      .execute();

      req.flash('info', i18next.t('flash.users.create.passwordChanged'));
      return reply.redirect(`/users/${userId}/edit`);
    });
};
