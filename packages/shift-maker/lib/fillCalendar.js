"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _getDay = _interopRequireDefault(require("date-fns/getDay"));

var _isBefore = _interopRequireDefault(require("date-fns/isBefore"));

var _addDays = _interopRequireDefault(require("date-fns/addDays"));

var _differenceInCalendarDays = _interopRequireDefault(require("date-fns/differenceInCalendarDays"));

var _isWithinInterval = _interopRequireDefault(require("date-fns/isWithinInterval"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var firstDay = function firstDay(startDate, firstHoliday) {
  var dowStartDate = (0, _getDay["default"])(startDate);
  if (dowStartDate === 0 || dowStartDate === 6) return startDate;
  var result = (0, _addDays["default"])(startDate, 6 - dowStartDate);
  if (firstHoliday && (0, _isBefore["default"])(firstHoliday, result)) return firstHoliday;
  return result;
};

var loop = function loop(size) {
  var arr = [];

  for (var i = 0; i < size; i++) {
    arr.push(undefined);
  }

  return arr;
};

var fillCalendar = function fillCalendar(config) {
  var _nextHoliday;

  var calendar = {};
  var startDate = config.start,
      endDate = config.end,
      defaults = config.defaults;
  var days = [];
  var holidays = config.holidays || [];
  var nextHoliday = holidays.shift();
  var currentDay = firstDay(startDate, (_nextHoliday = nextHoliday) === null || _nextHoliday === void 0 ? void 0 : _nextHoliday.start);

  while ((0, _isBefore["default"])(currentDay, endDate)) {
    var dow = (0, _getDay["default"])(currentDay);
    var numberOfSlots = (defaults === null || defaults === void 0 ? void 0 : defaults.numberOfSlots) || 3;
    var isNextHoliday = nextHoliday && (0, _isWithinInterval["default"])(currentDay, nextHoliday);

    var _endDate = isNextHoliday ? nextHoliday.end : dow === 0 ? currentDay : (0, _addDays["default"])(currentDay, 1);

    days.push(_objectSpread(_objectSpread(_objectSpread({}, defaults), isNextHoliday ? nextHoliday : {}), {}, {
      numberOfSlots: numberOfSlots,
      start: currentDay,
      end: _endDate,
      holiday: isNextHoliday,
      slots: loop(numberOfSlots),
      nextALongHoliday: undefined
    }));

    if (isNextHoliday) {
      nextHoliday = holidays.shift();
    }

    currentDay = (0, _addDays["default"])(_endDate, 1 + (5 - (0, _getDay["default"])(_endDate)));

    if (nextHoliday && (0, _isBefore["default"])(nextHoliday.start, currentDay)) {
      currentDay = nextHoliday.start;
    }
  }

  for (var i = 0; i < days.length; i++) {
    var _days$i = days[i],
        start = _days$i.start,
        end = _days$i.end;

    if ((0, _differenceInCalendarDays["default"])(end, start) > 1) {
      if (days[i - 1]) days[i - 1].nextALongHoliday = true;
      if (days[i + 1]) days[i + 1].nextALongHoliday = true;
    }
  }

  calendar.days = days;
  var slotCount = 0,
      slotDaysCount = 0;

  for (var _i = 0, _days = days; _i < _days.length; _i++) {
    var day = _days[_i];
    slotCount += day.numberOfSlots;
    slotDaysCount += day.numberOfSlots * (1 + (0, _differenceInCalendarDays["default"])(day.end, day.start));
  }

  calendar.slotCount = slotCount;
  calendar.slotDayCount = slotDaysCount;
  return calendar;
};

var _default = fillCalendar;
exports["default"] = _default;