"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18next = _interopRequireDefault(require("i18next"));

var _User = _interopRequireDefault(require("../entity/User.js"));

var _secure = _interopRequireDefault(require("./../lib/secure.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var _default = app => {
  app.get('/session/new', {
    name: 'newSession'
  }, (req, reply) => {
    const signInForm = {};
    reply.render('session/new', {
      signInForm
    });
    return reply;
  }).post('/session', {
    name: 'session'
  }, async (req, reply) => {
    const signInForm = req.body.object;
    const user = await _User.default.findOne({
      where: {
        email: signInForm.email
      }
    });

    if (!user || user.passwordDigest !== (0, _secure.default)(signInForm.password)) {
      req.flash('error', _i18next.default.t('flash.session.create.error'));
      return reply.render('session/new', {
        signInForm
      });
    }

    req.session.set('userId', user.id);
    req.flash('info', _i18next.default.t('flash.session.create.success'));
    return reply.redirect(app.reverse('root'));
  }).delete('/session', (req, reply) => {
    req.session.set('userId', null);
    req.flash('info', _i18next.default.t('flash.session.delete.success'));
    return reply.redirect(app.reverse('root'));
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9yb3V0ZXMvc2Vzc2lvbi5qcyJdLCJuYW1lcyI6WyJhcHAiLCJnZXQiLCJuYW1lIiwicmVxIiwicmVwbHkiLCJzaWduSW5Gb3JtIiwicmVuZGVyIiwicG9zdCIsImJvZHkiLCJvYmplY3QiLCJ1c2VyIiwiVXNlciIsImZpbmRPbmUiLCJ3aGVyZSIsImVtYWlsIiwicGFzc3dvcmREaWdlc3QiLCJwYXNzd29yZCIsImZsYXNoIiwiaTE4bmV4dCIsInQiLCJzZXNzaW9uIiwic2V0IiwiaWQiLCJyZWRpcmVjdCIsInJldmVyc2UiLCJkZWxldGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQUpBO2VBTWdCQSxHQUFELElBQVM7QUFDdEJBLEVBQUFBLEdBQUcsQ0FDQUMsR0FESCxDQUNPLGNBRFAsRUFDdUI7QUFBRUMsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FEdkIsRUFDK0MsQ0FBQ0MsR0FBRCxFQUFNQyxLQUFOLEtBQWdCO0FBQzNELFVBQU1DLFVBQVUsR0FBRyxFQUFuQjtBQUNBRCxJQUFBQSxLQUFLLENBQUNFLE1BQU4sQ0FBYSxhQUFiLEVBQTRCO0FBQUVELE1BQUFBO0FBQUYsS0FBNUI7QUFDQSxXQUFPRCxLQUFQO0FBQ0QsR0FMSCxFQU1HRyxJQU5ILENBTVEsVUFOUixFQU1vQjtBQUFFTCxJQUFBQSxJQUFJLEVBQUU7QUFBUixHQU5wQixFQU15QyxPQUFPQyxHQUFQLEVBQVlDLEtBQVosS0FBc0I7QUFDM0QsVUFBTUMsVUFBVSxHQUFHRixHQUFHLENBQUNLLElBQUosQ0FBU0MsTUFBNUI7QUFDQSxVQUFNQyxJQUFJLEdBQUcsTUFBTUMsY0FBS0MsT0FBTCxDQUFhO0FBQUVDLE1BQUFBLEtBQUssRUFBRTtBQUFFQyxRQUFBQSxLQUFLLEVBQUVULFVBQVUsQ0FBQ1M7QUFBcEI7QUFBVCxLQUFiLENBQW5COztBQUNBLFFBQUksQ0FBQ0osSUFBRCxJQUFVQSxJQUFJLENBQUNLLGNBQUwsS0FBd0IscUJBQVFWLFVBQVUsQ0FBQ1csUUFBbkIsQ0FBdEMsRUFBcUU7QUFDbkViLE1BQUFBLEdBQUcsQ0FBQ2MsS0FBSixDQUFVLE9BQVYsRUFBbUJDLGlCQUFRQyxDQUFSLENBQVUsNEJBQVYsQ0FBbkI7QUFDQSxhQUFPZixLQUFLLENBQUNFLE1BQU4sQ0FBYSxhQUFiLEVBQTRCO0FBQUVELFFBQUFBO0FBQUYsT0FBNUIsQ0FBUDtBQUNEOztBQUVERixJQUFBQSxHQUFHLENBQUNpQixPQUFKLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsRUFBMEJYLElBQUksQ0FBQ1ksRUFBL0I7QUFDQW5CLElBQUFBLEdBQUcsQ0FBQ2MsS0FBSixDQUFVLE1BQVYsRUFBa0JDLGlCQUFRQyxDQUFSLENBQVUsOEJBQVYsQ0FBbEI7QUFDQSxXQUFPZixLQUFLLENBQUNtQixRQUFOLENBQWV2QixHQUFHLENBQUN3QixPQUFKLENBQVksTUFBWixDQUFmLENBQVA7QUFDRCxHQWpCSCxFQWtCR0MsTUFsQkgsQ0FrQlUsVUFsQlYsRUFrQnNCLENBQUN0QixHQUFELEVBQU1DLEtBQU4sS0FBZ0I7QUFDbENELElBQUFBLEdBQUcsQ0FBQ2lCLE9BQUosQ0FBWUMsR0FBWixDQUFnQixRQUFoQixFQUEwQixJQUExQjtBQUNBbEIsSUFBQUEsR0FBRyxDQUFDYyxLQUFKLENBQVUsTUFBVixFQUFrQkMsaUJBQVFDLENBQVIsQ0FBVSw4QkFBVixDQUFsQjtBQUNBLFdBQU9mLEtBQUssQ0FBQ21CLFFBQU4sQ0FBZXZCLEdBQUcsQ0FBQ3dCLE9BQUosQ0FBWSxNQUFaLENBQWYsQ0FBUDtBQUNELEdBdEJIO0FBdUJELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuaW1wb3J0IGkxOG5leHQgZnJvbSAnaTE4bmV4dCc7XG5pbXBvcnQgVXNlciBmcm9tICcuLi9lbnRpdHkvVXNlci5qcyc7XG5pbXBvcnQgZW5jcnlwdCBmcm9tICcuLy4uL2xpYi9zZWN1cmUuanMnO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKSA9PiB7XG4gIGFwcFxuICAgIC5nZXQoJy9zZXNzaW9uL25ldycsIHsgbmFtZTogJ25ld1Nlc3Npb24nIH0sIChyZXEsIHJlcGx5KSA9PiB7XG4gICAgICBjb25zdCBzaWduSW5Gb3JtID0ge307XG4gICAgICByZXBseS5yZW5kZXIoJ3Nlc3Npb24vbmV3JywgeyBzaWduSW5Gb3JtIH0pO1xuICAgICAgcmV0dXJuIHJlcGx5O1xuICAgIH0pXG4gICAgLnBvc3QoJy9zZXNzaW9uJywgeyBuYW1lOiAnc2Vzc2lvbicgfSwgYXN5bmMgKHJlcSwgcmVwbHkpID0+IHtcbiAgICAgIGNvbnN0IHNpZ25JbkZvcm0gPSByZXEuYm9keS5vYmplY3Q7XG4gICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHsgd2hlcmU6IHsgZW1haWw6IHNpZ25JbkZvcm0uZW1haWwgfSB9KTtcbiAgICAgIGlmICghdXNlciB8fCAodXNlci5wYXNzd29yZERpZ2VzdCAhPT0gZW5jcnlwdChzaWduSW5Gb3JtLnBhc3N3b3JkKSkpIHtcbiAgICAgICAgcmVxLmZsYXNoKCdlcnJvcicsIGkxOG5leHQudCgnZmxhc2guc2Vzc2lvbi5jcmVhdGUuZXJyb3InKSk7XG4gICAgICAgIHJldHVybiByZXBseS5yZW5kZXIoJ3Nlc3Npb24vbmV3JywgeyBzaWduSW5Gb3JtIH0pO1xuICAgICAgfVxuXG4gICAgICByZXEuc2Vzc2lvbi5zZXQoJ3VzZXJJZCcsIHVzZXIuaWQpO1xuICAgICAgcmVxLmZsYXNoKCdpbmZvJywgaTE4bmV4dC50KCdmbGFzaC5zZXNzaW9uLmNyZWF0ZS5zdWNjZXNzJykpO1xuICAgICAgcmV0dXJuIHJlcGx5LnJlZGlyZWN0KGFwcC5yZXZlcnNlKCdyb290JykpO1xuICAgIH0pXG4gICAgLmRlbGV0ZSgnL3Nlc3Npb24nLCAocmVxLCByZXBseSkgPT4ge1xuICAgICAgcmVxLnNlc3Npb24uc2V0KCd1c2VySWQnLCBudWxsKTtcbiAgICAgIHJlcS5mbGFzaCgnaW5mbycsIGkxOG5leHQudCgnZmxhc2guc2Vzc2lvbi5kZWxldGUuc3VjY2VzcycpKTtcbiAgICAgIHJldHVybiByZXBseS5yZWRpcmVjdChhcHAucmV2ZXJzZSgncm9vdCcpKTtcbiAgICB9KTtcbn07XG4iXX0=