"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _parseISO = _interopRequireDefault(require("date-fns/parseISO"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var config = {
  start: (0, _parseISO["default"])("2021-02-01"),
  end: (0, _parseISO["default"])("2022-01-03"),
  holidays: [],
  defaults: {
    numberOfSlots: 3
  }
};
var _default = config;
exports["default"] = _default;