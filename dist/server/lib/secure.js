"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @param {string} value
 */
var _default = value => _crypto.default.createHash('sha256').update(value).digest('hex');

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvc2VjdXJlLmpzIl0sIm5hbWVzIjpbInZhbHVlIiwiY3J5cHRvIiwiY3JlYXRlSGFzaCIsInVwZGF0ZSIsImRpZ2VzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7O0FBRkE7O0FBSUE7OztlQUdnQkEsS0FBRCxJQUFXQyxnQkFBT0MsVUFBUCxDQUFrQixRQUFsQixFQUN2QkMsTUFEdUIsQ0FDaEJILEtBRGdCLEVBRXZCSSxNQUZ1QixDQUVoQixLQUZnQixDIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQHRzLWNoZWNrXG5cbmltcG9ydCBjcnlwdG8gZnJvbSAnY3J5cHRvJztcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgKHZhbHVlKSA9PiBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2JylcbiAgLnVwZGF0ZSh2YWx1ZSlcbiAgLmRpZ2VzdCgnaGV4Jyk7XG4iXX0=