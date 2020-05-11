"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _welcome = _interopRequireDefault(require("./welcome"));

var _users = _interopRequireDefault(require("./users"));

var _session = _interopRequireDefault(require("./session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check
const controllers = [_welcome.default, _users.default, _session.default];

var _default = app => controllers.forEach(f => f(app));

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9yb3V0ZXMvaW5kZXguanMiXSwibmFtZXMiOlsiY29udHJvbGxlcnMiLCJ3ZWxjb21lIiwidXNlcnMiLCJzZXNzaW9uIiwiYXBwIiwiZm9yRWFjaCIsImYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQUpBO0FBTUEsTUFBTUEsV0FBVyxHQUFHLENBQ2xCQyxnQkFEa0IsRUFFbEJDLGNBRmtCLEVBR2xCQyxnQkFIa0IsQ0FBcEI7O2VBTWdCQyxHQUFELElBQVNKLFdBQVcsQ0FBQ0ssT0FBWixDQUFxQkMsQ0FBRCxJQUFPQSxDQUFDLENBQUNGLEdBQUQsQ0FBNUIsQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG5pbXBvcnQgd2VsY29tZSBmcm9tICcuL3dlbGNvbWUnO1xuaW1wb3J0IHVzZXJzIGZyb20gJy4vdXNlcnMnO1xuaW1wb3J0IHNlc3Npb24gZnJvbSAnLi9zZXNzaW9uJztcblxuY29uc3QgY29udHJvbGxlcnMgPSBbXG4gIHdlbGNvbWUsXG4gIHVzZXJzLFxuICBzZXNzaW9uLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgKGFwcCkgPT4gY29udHJvbGxlcnMuZm9yRWFjaCgoZikgPT4gZihhcHApKTtcbiJdfQ==