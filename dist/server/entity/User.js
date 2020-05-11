"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _classValidator = require("class-validator");

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _temp;

function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'proposal-class-properties is enabled and runs after the decorators transform.'); }

let User = (_dec = (0, _typeorm.Entity)(), _dec2 = (0, _typeorm.PrimaryGeneratedColumn)(), _dec3 = (0, _typeorm.Column)('varchar'), _dec4 = (0, _classValidator.IsEmail)(), _dec5 = (0, _classValidator.IsNotEmpty)(), _dec6 = (0, _classValidator.IsNotEmpty)(), _dec7 = (0, _typeorm.Column)('varchar'), _dec8 = (0, _classValidator.IsNotEmpty)(), _dec(_class = (_class2 = (_temp = class User extends _typeorm.BaseEntity {
  constructor(...args) {
    super(...args);

    _initializerDefineProperty(this, "id", _descriptor, this);

    _initializerDefineProperty(this, "email", _descriptor2, this);

    _initializerDefineProperty(this, "password", _descriptor3, this);

    _initializerDefineProperty(this, "passwordDigest", _descriptor4, this);
  }

}, _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return null;
  }
}), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "email", [_dec3, _dec4, _dec5], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '';
  }
}), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "password", [_dec6], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '';
  }
}), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "passwordDigest", [_dec7, _dec8], {
  configurable: true,
  enumerable: true,
  writable: true,
  initializer: function () {
    return '';
  }
})), _class2)) || _class);
var _default = User;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9lbnRpdHkvVXNlci5qcyJdLCJuYW1lcyI6WyJVc2VyIiwiQmFzZUVudGl0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7Ozs7O0lBR01BLEksV0FETCxzQixVQUVFLHNDLFVBR0EscUJBQU8sU0FBUCxDLFVBQ0EsOEIsVUFDQSxpQyxVQUdBLGlDLFVBR0EscUJBQU8sU0FBUCxDLFVBQ0EsaUMsb0NBZEgsTUFDTUEsSUFETixTQUNtQkMsbUJBRG5CLENBQzhCO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTs7QUFBQTtBQUFBOztBQUFBLEM7Ozs7O1dBRXZCLEk7Ozs7Ozs7V0FLRyxFOzs7Ozs7O1dBR0csRTs7Ozs7OztXQUlNLEU7OztlQUdKRCxJIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW50aXR5LCBQcmltYXJ5R2VuZXJhdGVkQ29sdW1uLCBDb2x1bW4sIEJhc2VFbnRpdHkgfSBmcm9tICd0eXBlb3JtJztcbmltcG9ydCB7IElzTm90RW1wdHksIElzRW1haWwgfSBmcm9tICdjbGFzcy12YWxpZGF0b3InO1xuXG5ARW50aXR5KClcbmNsYXNzIFVzZXIgZXh0ZW5kcyBCYXNlRW50aXR5IHtcbiAgQFByaW1hcnlHZW5lcmF0ZWRDb2x1bW4oKVxuICBpZCA9IG51bGw7XG5cbiAgQENvbHVtbigndmFyY2hhcicpXG4gIEBJc0VtYWlsKClcbiAgQElzTm90RW1wdHkoKVxuICBlbWFpbCA9ICcnO1xuXG4gIEBJc05vdEVtcHR5KClcbiAgcGFzc3dvcmQgPSAnJztcblxuICBAQ29sdW1uKCd2YXJjaGFyJylcbiAgQElzTm90RW1wdHkoKVxuICBwYXNzd29yZERpZ2VzdCA9ICcnO1xufVxuXG5leHBvcnQgZGVmYXVsdCBVc2VyO1xuIl19