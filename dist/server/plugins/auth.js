"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fastifyPlugin = _interopRequireDefault(require("fastify-plugin"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
var _default = (0, _fastifyPlugin.default)((fastify, _opts, next) => {
  fastify.decorate('state', {});
  fastify.decorate('isSignedIn', () => _lodash.default.get(fastify, 'state.authenticated', false));
  fastify.addHook('preValidation', (req, _reply, done) => {
    const authenticated = !_lodash.default.isUndefined(req.session.userId);

    _lodash.default.set(fastify, 'state.authenticated', authenticated);

    done();
  });
  next();
});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9wbHVnaW5zL2F1dGguanMiXSwibmFtZXMiOlsiZmFzdGlmeSIsIl9vcHRzIiwibmV4dCIsImRlY29yYXRlIiwiXyIsImdldCIsImFkZEhvb2siLCJyZXEiLCJfcmVwbHkiLCJkb25lIiwiYXV0aGVudGljYXRlZCIsImlzVW5kZWZpbmVkIiwic2Vzc2lvbiIsInVzZXJJZCIsInNldCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOztBQUNBOzs7O0FBSEE7ZUFLZSw0QkFBRyxDQUFDQSxPQUFELEVBQVVDLEtBQVYsRUFBaUJDLElBQWpCLEtBQTBCO0FBQzFDRixFQUFBQSxPQUFPLENBQUNHLFFBQVIsQ0FBaUIsT0FBakIsRUFBMEIsRUFBMUI7QUFDQUgsRUFBQUEsT0FBTyxDQUFDRyxRQUFSLENBQWlCLFlBQWpCLEVBQStCLE1BQU1DLGdCQUFFQyxHQUFGLENBQU1MLE9BQU4sRUFBZSxxQkFBZixFQUFzQyxLQUF0QyxDQUFyQztBQUVBQSxFQUFBQSxPQUFPLENBQUNNLE9BQVIsQ0FBZ0IsZUFBaEIsRUFBaUMsQ0FBQ0MsR0FBRCxFQUFNQyxNQUFOLEVBQWNDLElBQWQsS0FBdUI7QUFDdEQsVUFBTUMsYUFBYSxHQUFHLENBQUNOLGdCQUFFTyxXQUFGLENBQWNKLEdBQUcsQ0FBQ0ssT0FBSixDQUFZQyxNQUExQixDQUF2Qjs7QUFDQVQsb0JBQUVVLEdBQUYsQ0FBTWQsT0FBTixFQUFlLHFCQUFmLEVBQXNDVSxhQUF0Qzs7QUFDQUQsSUFBQUEsSUFBSTtBQUNMLEdBSkQ7QUFNQVAsRUFBQUEsSUFBSTtBQUNMLENBWGMsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG5pbXBvcnQgZnAgZnJvbSAnZmFzdGlmeS1wbHVnaW4nO1xuaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcblxuZXhwb3J0IGRlZmF1bHQgZnAoKGZhc3RpZnksIF9vcHRzLCBuZXh0KSA9PiB7XG4gIGZhc3RpZnkuZGVjb3JhdGUoJ3N0YXRlJywge30pO1xuICBmYXN0aWZ5LmRlY29yYXRlKCdpc1NpZ25lZEluJywgKCkgPT4gXy5nZXQoZmFzdGlmeSwgJ3N0YXRlLmF1dGhlbnRpY2F0ZWQnLCBmYWxzZSkpO1xuXG4gIGZhc3RpZnkuYWRkSG9vaygncHJlVmFsaWRhdGlvbicsIChyZXEsIF9yZXBseSwgZG9uZSkgPT4ge1xuICAgIGNvbnN0IGF1dGhlbnRpY2F0ZWQgPSAhXy5pc1VuZGVmaW5lZChyZXEuc2Vzc2lvbi51c2VySWQpO1xuICAgIF8uc2V0KGZhc3RpZnksICdzdGF0ZS5hdXRoZW50aWNhdGVkJywgYXV0aGVudGljYXRlZCk7XG4gICAgZG9uZSgpO1xuICB9KTtcblxuICBuZXh0KCk7XG59KTtcbiJdfQ==