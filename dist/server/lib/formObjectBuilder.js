"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildFromModel = exports.buildFromObj = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// @ts-check

/**
 * @param {Object} object
 * @param {Object} errors
 */
const buildFromObj = (object, errors = {}) => ({
  init: false,
  name: 'form',
  form: object,
  errors: _lodash.default.groupBy(errors, 'path')
});
/**
 * @param {Object} object
 * @param {Object} errors
 */


exports.buildFromObj = buildFromObj;

const buildFromModel = (object, errors = {}) => ({
  init: true,
  name: 'form',
  form: Object.keys(object).reduce((acc, field) => ({ ...acc,
    [field]: ''
  }), {}),
  errors
});

exports.buildFromModel = buildFromModel;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvZm9ybU9iamVjdEJ1aWxkZXIuanMiXSwibmFtZXMiOlsiYnVpbGRGcm9tT2JqIiwib2JqZWN0IiwiZXJyb3JzIiwiaW5pdCIsIm5hbWUiLCJmb3JtIiwiXyIsImdyb3VwQnkiLCJidWlsZEZyb21Nb2RlbCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2MiLCJmaWVsZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7O0FBRkE7O0FBSUE7Ozs7QUFJTyxNQUFNQSxZQUFZLEdBQUcsQ0FBQ0MsTUFBRCxFQUFTQyxNQUFNLEdBQUcsRUFBbEIsTUFBMEI7QUFDcERDLEVBQUFBLElBQUksRUFBRSxLQUQ4QztBQUVwREMsRUFBQUEsSUFBSSxFQUFFLE1BRjhDO0FBR3BEQyxFQUFBQSxJQUFJLEVBQUVKLE1BSDhDO0FBSXBEQyxFQUFBQSxNQUFNLEVBQUVJLGdCQUFFQyxPQUFGLENBQVVMLE1BQVYsRUFBa0IsTUFBbEI7QUFKNEMsQ0FBMUIsQ0FBckI7QUFPUDs7Ozs7Ozs7QUFJTyxNQUFNTSxjQUFjLEdBQUcsQ0FBQ1AsTUFBRCxFQUFTQyxNQUFNLEdBQUcsRUFBbEIsTUFBMEI7QUFDdERDLEVBQUFBLElBQUksRUFBRSxJQURnRDtBQUV0REMsRUFBQUEsSUFBSSxFQUFFLE1BRmdEO0FBR3REQyxFQUFBQSxJQUFJLEVBQUVJLE1BQU0sQ0FBQ0MsSUFBUCxDQUFZVCxNQUFaLEVBQW9CVSxNQUFwQixDQUEyQixDQUFDQyxHQUFELEVBQU1DLEtBQU4sTUFBaUIsRUFBRSxHQUFHRCxHQUFMO0FBQVUsS0FBQ0MsS0FBRCxHQUFTO0FBQW5CLEdBQWpCLENBQTNCLEVBQXNFLEVBQXRFLENBSGdEO0FBSXREWCxFQUFBQTtBQUpzRCxDQUExQixDQUF2QiIsInNvdXJjZXNDb250ZW50IjpbIi8vIEB0cy1jaGVja1xuXG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvcnNcbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkRnJvbU9iaiA9IChvYmplY3QsIGVycm9ycyA9IHt9KSA9PiAoe1xuICBpbml0OiBmYWxzZSxcbiAgbmFtZTogJ2Zvcm0nLFxuICBmb3JtOiBvYmplY3QsXG4gIGVycm9yczogXy5ncm91cEJ5KGVycm9ycywgJ3BhdGgnKSxcbn0pO1xuXG4vKipcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3RcbiAqIEBwYXJhbSB7T2JqZWN0fSBlcnJvcnNcbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWxkRnJvbU1vZGVsID0gKG9iamVjdCwgZXJyb3JzID0ge30pID0+ICh7XG4gIGluaXQ6IHRydWUsXG4gIG5hbWU6ICdmb3JtJyxcbiAgZm9ybTogT2JqZWN0LmtleXMob2JqZWN0KS5yZWR1Y2UoKGFjYywgZmllbGQpID0+ICh7IC4uLmFjYywgW2ZpZWxkXTogJycgfSksIHt9KSxcbiAgZXJyb3JzLFxufSk7XG4iXX0=