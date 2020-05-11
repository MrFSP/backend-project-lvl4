"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18next = _interopRequireDefault(require("i18next"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = app => ({
  route(name) {
    return app.reverse(name);
  },

  t(key) {
    return _i18next.default.t(key);
  },

  _: _lodash.default,

  getAlertClass(type) {
    switch (type) {
      case 'error':
        return 'danger';

      case 'info':
        return 'info';

      default:
        throw new Error(`Unknown type: '${type}'`);
    }
  }

});

exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9oZWxwZXJzL2luZGV4LmpzIl0sIm5hbWVzIjpbImFwcCIsInJvdXRlIiwibmFtZSIsInJldmVyc2UiLCJ0Iiwia2V5IiwiaTE4bmV4dCIsIl8iLCJnZXRBbGVydENsYXNzIiwidHlwZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7Ozs7ZUFFZ0JBLEdBQUQsS0FBVTtBQUN2QkMsRUFBQUEsS0FBSyxDQUFDQyxJQUFELEVBQU87QUFDVixXQUFPRixHQUFHLENBQUNHLE9BQUosQ0FBWUQsSUFBWixDQUFQO0FBQ0QsR0FIc0I7O0FBSXZCRSxFQUFBQSxDQUFDLENBQUNDLEdBQUQsRUFBTTtBQUNMLFdBQU9DLGlCQUFRRixDQUFSLENBQVVDLEdBQVYsQ0FBUDtBQUNELEdBTnNCOztBQU92QkUsRUFBQUEsQ0FBQyxFQUFEQSxlQVB1Qjs7QUFRdkJDLEVBQUFBLGFBQWEsQ0FBQ0MsSUFBRCxFQUFPO0FBQ2xCLFlBQVFBLElBQVI7QUFDRSxXQUFLLE9BQUw7QUFDRSxlQUFPLFFBQVA7O0FBQ0YsV0FBSyxNQUFMO0FBQ0UsZUFBTyxNQUFQOztBQUNGO0FBQ0UsY0FBTSxJQUFJQyxLQUFKLENBQVcsa0JBQWlCRCxJQUFLLEdBQWpDLENBQU47QUFOSjtBQVFEOztBQWpCc0IsQ0FBVixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGkxOG5leHQgZnJvbSAnaTE4bmV4dCc7XG5pbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuXG5leHBvcnQgZGVmYXVsdCAoYXBwKSA9PiAoe1xuICByb3V0ZShuYW1lKSB7XG4gICAgcmV0dXJuIGFwcC5yZXZlcnNlKG5hbWUpO1xuICB9LFxuICB0KGtleSkge1xuICAgIHJldHVybiBpMThuZXh0LnQoa2V5KTtcbiAgfSxcbiAgXyxcbiAgZ2V0QWxlcnRDbGFzcyh0eXBlKSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdlcnJvcic6XG4gICAgICAgIHJldHVybiAnZGFuZ2VyJztcbiAgICAgIGNhc2UgJ2luZm8nOlxuICAgICAgICByZXR1cm4gJ2luZm8nO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHR5cGU6ICcke3R5cGV9J2ApO1xuICAgIH1cbiAgfSxcbn0pO1xuIl19