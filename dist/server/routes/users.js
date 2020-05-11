"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18next = _interopRequireDefault(require("i18next"));

var _classValidator = require("class-validator");

var _lodash = _interopRequireDefault(require("lodash"));

var _secure = _interopRequireDefault(require("../lib/secure.js"));

var _User = _interopRequireDefault(require("../entity/User.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
// import { buildFromObj, buildFromModel } from '../lib/formObjectBuilder';
var _default = app => {
  app.get('/users', {
    name: 'users'
  }, async (req, reply) => {
    const users = await app.orm.getRepository(_User.default).find();
    reply.render('users/index', {
      users
    });
    return reply;
  }).get('/users/new', {
    name: 'newUser'
  }, async (req, reply) => {
    //     const params = buildFromModel(User.rawAttributes);
    const user = new _User.default();
    reply.render('users/new', {
      user
    });
    return reply;
  }).post('/users', async (req, reply) => {
    const user = _User.default.create(req.body.user);

    user.password = req.body.user.password;
    user.passwordDigest = (0, _secure.default)(user.password);
    const errors = await (0, _classValidator.validate)(user);

    if (!_lodash.default.isEmpty(errors)) {
      req.flash('error', _i18next.default.t('flash.users.create.error'));
      return reply.render('users/new', {
        user,
        errors
      });
    }

    await user.save();
    req.flash('info', _i18next.default.t('flash.users.create.success'));
    return reply.redirect(app.reverse('root'));
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9yb3V0ZXMvdXNlcnMuanMiXSwibmFtZXMiOlsiYXBwIiwiZ2V0IiwibmFtZSIsInJlcSIsInJlcGx5IiwidXNlcnMiLCJvcm0iLCJnZXRSZXBvc2l0b3J5IiwiVXNlciIsImZpbmQiLCJyZW5kZXIiLCJ1c2VyIiwicG9zdCIsImNyZWF0ZSIsImJvZHkiLCJwYXNzd29yZCIsInBhc3N3b3JkRGlnZXN0IiwiZXJyb3JzIiwiXyIsImlzRW1wdHkiLCJmbGFzaCIsImkxOG5leHQiLCJ0Iiwic2F2ZSIsInJlZGlyZWN0IiwicmV2ZXJzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBTkE7QUFPQTtlQUVnQkEsR0FBRCxJQUFTO0FBQ3RCQSxFQUFBQSxHQUFHLENBQ0FDLEdBREgsQ0FDTyxRQURQLEVBQ2lCO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFSLEdBRGpCLEVBQ29DLE9BQU9DLEdBQVAsRUFBWUMsS0FBWixLQUFzQjtBQUN0RCxVQUFNQyxLQUFLLEdBQUcsTUFBTUwsR0FBRyxDQUFDTSxHQUFKLENBQVFDLGFBQVIsQ0FBc0JDLGFBQXRCLEVBQTRCQyxJQUE1QixFQUFwQjtBQUNBTCxJQUFBQSxLQUFLLENBQUNNLE1BQU4sQ0FBYSxhQUFiLEVBQTRCO0FBQUVMLE1BQUFBO0FBQUYsS0FBNUI7QUFDQSxXQUFPRCxLQUFQO0FBQ0QsR0FMSCxFQU1HSCxHQU5ILENBTU8sWUFOUCxFQU1xQjtBQUFFQyxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQU5yQixFQU0wQyxPQUFPQyxHQUFQLEVBQVlDLEtBQVosS0FBc0I7QUFDOUQ7QUFDRSxVQUFNTyxJQUFJLEdBQUcsSUFBSUgsYUFBSixFQUFiO0FBQ0FKLElBQUFBLEtBQUssQ0FBQ00sTUFBTixDQUFhLFdBQWIsRUFBMEI7QUFBRUMsTUFBQUE7QUFBRixLQUExQjtBQUNBLFdBQU9QLEtBQVA7QUFDRCxHQVhILEVBWUdRLElBWkgsQ0FZUSxRQVpSLEVBWWtCLE9BQU9ULEdBQVAsRUFBWUMsS0FBWixLQUFzQjtBQUNwQyxVQUFNTyxJQUFJLEdBQUdILGNBQUtLLE1BQUwsQ0FBWVYsR0FBRyxDQUFDVyxJQUFKLENBQVNILElBQXJCLENBQWI7O0FBQ0FBLElBQUFBLElBQUksQ0FBQ0ksUUFBTCxHQUFnQlosR0FBRyxDQUFDVyxJQUFKLENBQVNILElBQVQsQ0FBY0ksUUFBOUI7QUFDQUosSUFBQUEsSUFBSSxDQUFDSyxjQUFMLEdBQXNCLHFCQUFRTCxJQUFJLENBQUNJLFFBQWIsQ0FBdEI7QUFFQSxVQUFNRSxNQUFNLEdBQUcsTUFBTSw4QkFBU04sSUFBVCxDQUFyQjs7QUFDQSxRQUFJLENBQUNPLGdCQUFFQyxPQUFGLENBQVVGLE1BQVYsQ0FBTCxFQUF3QjtBQUN0QmQsTUFBQUEsR0FBRyxDQUFDaUIsS0FBSixDQUFVLE9BQVYsRUFBbUJDLGlCQUFRQyxDQUFSLENBQVUsMEJBQVYsQ0FBbkI7QUFDQSxhQUFPbEIsS0FBSyxDQUFDTSxNQUFOLENBQWEsV0FBYixFQUEwQjtBQUFFQyxRQUFBQSxJQUFGO0FBQVFNLFFBQUFBO0FBQVIsT0FBMUIsQ0FBUDtBQUNEOztBQUNELFVBQU1OLElBQUksQ0FBQ1ksSUFBTCxFQUFOO0FBQ0FwQixJQUFBQSxHQUFHLENBQUNpQixLQUFKLENBQVUsTUFBVixFQUFrQkMsaUJBQVFDLENBQVIsQ0FBVSw0QkFBVixDQUFsQjtBQUNBLFdBQU9sQixLQUFLLENBQUNvQixRQUFOLENBQWV4QixHQUFHLENBQUN5QixPQUFKLENBQVksTUFBWixDQUFmLENBQVA7QUFDRCxHQXpCSDtBQTBCRCxDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCBpMThuZXh0IGZyb20gJ2kxOG5leHQnO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICdjbGFzcy12YWxpZGF0b3InO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcbmltcG9ydCBlbmNyeXB0IGZyb20gJy4uL2xpYi9zZWN1cmUuanMnO1xuaW1wb3J0IFVzZXIgZnJvbSAnLi4vZW50aXR5L1VzZXIuanMnO1xuLy8gaW1wb3J0IHsgYnVpbGRGcm9tT2JqLCBidWlsZEZyb21Nb2RlbCB9IGZyb20gJy4uL2xpYi9mb3JtT2JqZWN0QnVpbGRlcic7XG5cbmV4cG9ydCBkZWZhdWx0IChhcHApID0+IHtcbiAgYXBwXG4gICAgLmdldCgnL3VzZXJzJywgeyBuYW1lOiAndXNlcnMnIH0sIGFzeW5jIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCB1c2VycyA9IGF3YWl0IGFwcC5vcm0uZ2V0UmVwb3NpdG9yeShVc2VyKS5maW5kKCk7XG4gICAgICByZXBseS5yZW5kZXIoJ3VzZXJzL2luZGV4JywgeyB1c2VycyB9KTtcbiAgICAgIHJldHVybiByZXBseTtcbiAgICB9KVxuICAgIC5nZXQoJy91c2Vycy9uZXcnLCB7IG5hbWU6ICduZXdVc2VyJyB9LCBhc3luYyAocmVxLCByZXBseSkgPT4ge1xuICAgIC8vICAgICBjb25zdCBwYXJhbXMgPSBidWlsZEZyb21Nb2RlbChVc2VyLnJhd0F0dHJpYnV0ZXMpO1xuICAgICAgY29uc3QgdXNlciA9IG5ldyBVc2VyKCk7XG4gICAgICByZXBseS5yZW5kZXIoJ3VzZXJzL25ldycsIHsgdXNlciB9KTtcbiAgICAgIHJldHVybiByZXBseTtcbiAgICB9KVxuICAgIC5wb3N0KCcvdXNlcnMnLCBhc3luYyAocmVxLCByZXBseSkgPT4ge1xuICAgICAgY29uc3QgdXNlciA9IFVzZXIuY3JlYXRlKHJlcS5ib2R5LnVzZXIpO1xuICAgICAgdXNlci5wYXNzd29yZCA9IHJlcS5ib2R5LnVzZXIucGFzc3dvcmQ7XG4gICAgICB1c2VyLnBhc3N3b3JkRGlnZXN0ID0gZW5jcnlwdCh1c2VyLnBhc3N3b3JkKTtcblxuICAgICAgY29uc3QgZXJyb3JzID0gYXdhaXQgdmFsaWRhdGUodXNlcik7XG4gICAgICBpZiAoIV8uaXNFbXB0eShlcnJvcnMpKSB7XG4gICAgICAgIHJlcS5mbGFzaCgnZXJyb3InLCBpMThuZXh0LnQoJ2ZsYXNoLnVzZXJzLmNyZWF0ZS5lcnJvcicpKTtcbiAgICAgICAgcmV0dXJuIHJlcGx5LnJlbmRlcigndXNlcnMvbmV3JywgeyB1c2VyLCBlcnJvcnMgfSk7XG4gICAgICB9XG4gICAgICBhd2FpdCB1c2VyLnNhdmUoKTtcbiAgICAgIHJlcS5mbGFzaCgnaW5mbycsIGkxOG5leHQudCgnZmxhc2gudXNlcnMuY3JlYXRlLnN1Y2Nlc3MnKSk7XG4gICAgICByZXR1cm4gcmVwbHkucmVkaXJlY3QoYXBwLnJldmVyc2UoJ3Jvb3QnKSk7XG4gICAgfSk7XG59O1xuIl19