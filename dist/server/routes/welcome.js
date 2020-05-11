"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

// @ts-check
var _default = app => {
  app.get('/', {
    name: 'root'
  }, (_req, reply) => {
    reply.render('welcome/index');
  });
};

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9yb3V0ZXMvd2VsY29tZS5qcyJdLCJuYW1lcyI6WyJhcHAiLCJnZXQiLCJuYW1lIiwiX3JlcSIsInJlcGx5IiwicmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7ZUFFZ0JBLEdBQUQsSUFBUztBQUN0QkEsRUFBQUEsR0FBRyxDQUNBQyxHQURILENBQ08sR0FEUCxFQUNZO0FBQUVDLElBQUFBLElBQUksRUFBRTtBQUFSLEdBRFosRUFDOEIsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLEtBQWlCO0FBQzNDQSxJQUFBQSxLQUFLLENBQUNDLE1BQU4sQ0FBYSxlQUFiO0FBQ0QsR0FISDtBQUlELEMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBAdHMtY2hlY2tcblxuZXhwb3J0IGRlZmF1bHQgKGFwcCkgPT4ge1xuICBhcHBcbiAgICAuZ2V0KCcvJywgeyBuYW1lOiAncm9vdCcgfSwgKF9yZXEsIHJlcGx5KSA9PiB7XG4gICAgICByZXBseS5yZW5kZXIoJ3dlbGNvbWUvaW5kZXgnKTtcbiAgICB9KTtcbn07XG4iXX0=