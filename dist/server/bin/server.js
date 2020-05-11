#! /usr/bin/env node
"use strict";

var _index = _interopRequireDefault(require("../index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const port = process.env.PORT || 5000;
const address = '0.0.0.0';
(0, _index.default)().listen(port, address, () => {
  console.log(`Server is running on port: ${port}`);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9iaW4vc2VydmVyLmpzIl0sIm5hbWVzIjpbInBvcnQiLCJwcm9jZXNzIiwiZW52IiwiUE9SVCIsImFkZHJlc3MiLCJsaXN0ZW4iLCJjb25zb2xlIiwibG9nIl0sIm1hcHBpbmdzIjoiQUFBQTs7O0FBRUE7Ozs7QUFFQSxNQUFNQSxJQUFJLEdBQUdDLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyxJQUFaLElBQW9CLElBQWpDO0FBQ0EsTUFBTUMsT0FBTyxHQUFHLFNBQWhCO0FBRUEsc0JBQVNDLE1BQVQsQ0FBZ0JMLElBQWhCLEVBQXNCSSxPQUF0QixFQUErQixNQUFNO0FBQ25DRSxFQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBYSw4QkFBNkJQLElBQUssRUFBL0M7QUFDRCxDQUZEIiwic291cmNlc0NvbnRlbnQiOlsiIyEgL3Vzci9iaW4vZW52IG5vZGVcblxuaW1wb3J0IGdldEFwcCBmcm9tICcuLi9pbmRleC5qcyc7XG5cbmNvbnN0IHBvcnQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDUwMDA7XG5jb25zdCBhZGRyZXNzID0gJzAuMC4wLjAnO1xuXG5nZXRBcHAoKS5saXN0ZW4ocG9ydCwgYWRkcmVzcywgKCkgPT4ge1xuICBjb25zb2xlLmxvZyhgU2VydmVyIGlzIHJ1bm5pbmcgb24gcG9ydDogJHtwb3J0fWApO1xufSk7XG4iXX0=