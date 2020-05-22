// @ts-check

import i18next from 'i18next';
import { validate } from 'class-validator';
import _ from 'lodash';
import encrypt from '../lib/secure.js';
import User from '../entity/User.js';
// import { buildFromObj, buildFromModel } from '../lib/formObjectBuilder';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.orm.getRepository(User).find();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, async (req, reply) => {
      // const params = buildFromModel(User.rawAttributes);
      const user = new User();
      reply.render('users/new', { user });
      return reply;
    })
    .get('/users/password', { name: 'password' }, async (req, reply) => {
      const pass = {
        oldPass: '',
        newPass: '',
        confirmNewPass: '',
      }
      const passKeys = Object.keys(pass)
      return reply.render('users/password/index', { pass, passKeys });
    })
    .get('/users/user', { name: 'user' }, async (req, reply) => {
      const userId = req.session.get('userId');

      const user = await app.orm
        .getRepository(User)
        .findOne(userId);

      const keys = Object.keys(user)
        .filter((key) => !['passwordDigest', 'id'].includes(key));

      return reply.render('users/user', { user, keys });
    })
    .post('/users', async (req, reply) => {
      const user = User.create(req.body.user);
      user.password = req.body.user.password;
      user.passwordDigest = encrypt(user.password);

      const errors = await validate(user);
      if (!_.isEmpty(errors)) {
        req.flash('error', i18next.t('flash.users.create.error'));
        return reply.render('/users/new', { user, errors });
      }
      try {
        await user.save();
        req.flash('info', i18next.t('flash.users.create.success'));
        return reply.redirect(app.reverse('newSession'));
      }
      catch(err) {
        if (err.errno === 19) {
          req.flash('error', i18next.t('flash.users.create.emailExists'));
          return reply.redirect(app.reverse('newUser'));
        }
        throw err;
      }
    })
    .post('/users/password/index', { name: 'userUpdatePassword' }, async (req, reply) => {
      const pass = req.body.object;
      const userId = req.session.get('userId');
      const user = await app.orm
        .getRepository(User)
        .findOne(userId);
      const isCorrectOldPassword = encrypt(pass.oldPass) === user.passwordDigest;
      if (!isCorrectOldPassword) {
        req.flash('error', i18next.t('flash.users.create.wrongOldPass'));
        return reply.redirect(app.reverse('password'));
      }
      const isCorrectRepeatedPassword = pass.newPass === pass.confirmNewPass;
      if (!isCorrectRepeatedPassword) {
        req.flash('error', i18next.t('flash.users.create.wrongConfirmation'));
        return reply.redirect(app.reverse('password'));
      }
      user.passwordDigest = encrypt(pass.newPass);
      await app.orm
        .createQueryBuilder()
        .update(User)
        .set(user)
        .where("id = :id", { id: userId })
        .execute();
      req.flash('info', i18next.t('flash.users.create.passwordChanged'));
      reply.redirect(app.reverse('user'));
      return;
    })
    .post('/users/user', { name: 'userUpdate' }, async (req, reply) => {
      const user = req.body.user;
      const userId = req.session.get('userId');
      await app.orm
        .createQueryBuilder()
        .update(User)
        .set(user)
        .where("id = :id", { id: userId })
        .execute();
      req.flash('info', i18next.t('views.user.accountUpdated'));
      reply.redirect(app.reverse('user'));
      return;
    })
    .delete('/users/user', async (req, reply) => {
      const userId = req.session.get('userId');
      await app.orm
        .createQueryBuilder()
        .delete()
        .from(User)
        .where("id = :id", { id: userId })
        .execute();
      req.session.delete();
      reply.redirect(app.reverse('root'));
      req.flash('info', i18next.t('views.user.accountDeleted'));
      return;
    });
};
