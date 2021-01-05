"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fillCalendar = _interopRequireDefault(require("./fillCalendar"));

var _isWithinInterval = _interopRequireDefault(require("date-fns/isWithinInterval"));

var _differenceInCalendarDays = _interopRequireDefault(require("date-fns/differenceInCalendarDays"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var dateSorter = function dateSorter(d1, d2) {
  return [function (d) {
    return d.specialHoliday ? -1 : 0;
  }, function (d) {
    return -1 * (0, _differenceInCalendarDays["default"])(d.end, d.start) + 1;
  }, function (d) {
    return d.nextALongHoliday ? -1 : 0;
  }, function (d) {
    return d.start.getTime();
  }].reduce(function (acc, fn) {
    return acc !== 0 ? acc : fn(d1) - fn(d2);
  }, 0);
};

var filter = function filter(currentDate) {
  return function (p) {
    if (p.blockedDateRanges.find(function (r) {
      return (0, _isWithinInterval["default"])(currentDate.start, r) || (0, _isWithinInterval["default"])(currentDate.end, r);
    }) || p.pickedDates.find(function (r) {
      return (0, _isWithinInterval["default"])(currentDate.start, r) || (0, _isWithinInterval["default"])(currentDate.end, r);
    })) {
      return false;
    }

    return true;
  };
};

var participantSorter = function participantSorter(date) {
  return function (p1, p2) {
    return [function (p1) {
      return p1.remainingSlots > 1 ? -1 : 0;
    }, function (p1) {
      return Math.round(-0.5 * Math.min.apply(Math, [Number.MAX_VALUE].concat(_toConsumableArray(p1.pickedDates.map(function (pickedDate) {
        return Math.min(Math.abs((0, _differenceInCalendarDays["default"])(date, pickedDate.start)));
      })))));
    }, function (p1) {
      return -1 * Math.round(0.6 * p1.remainingSlots / p1.totalSlots);
    }, function (p1) {
      return -1 * Math.min.apply(Math, [Number.MAX_VALUE].concat(_toConsumableArray(p1.pickedDates.map(function (pickedDate) {
        return Math.min(Math.abs((0, _differenceInCalendarDays["default"])(date, pickedDate.start)));
      }))));
    }, function (p1) {
      return -1 * Math.round(100 * p1.remainingSlots / p1.totalSlots);
    }, function (p1) {
      return p1.pickedDates.length;
    }, function (p1) {
      return p1.numberOfDays;
    }].reduce(function (acc, fn) {
      return acc !== 0 ? acc : fn(p1) - fn(p2);
    }, 0);
  };
};

var make = function make(calendarConfig, participants) {
  var calendar = (0, _fillCalendar["default"])(calendarConfig);
  var participantMonthCount = participants.reduce(function (acc, r) {
    return acc + (r.onlyOncePerMonth ? 0.5 : 1) * (12 - r.vacationTime);
  }, 0);
  var expectedSlotsPerParticipantMonth = calendar.slotCount / participantMonthCount;
  var participantsWithStats = participants.map(function (r) {
    return _objectSpread(_objectSpread({}, r), {}, {
      numberOfHolidays: 0,
      numberOfWeekends: 0,
      numberOfDays: 0,
      pickedDates: [],
      blockedDateRanges: _toConsumableArray(r.vacationDays),
      totalSlots: (r.onlyOncePerMonth ? 0.5 : 1) * (12 - r.vacationTime) * expectedSlotsPerParticipantMonth,
      remainingSlots: (r.onlyOncePerMonth ? 0.5 : 1) * (12 - r.vacationTime) * expectedSlotsPerParticipantMonth
    });
  });

  var sortedDates = _toConsumableArray(calendar.days).sort(dateSorter);

  console.log(sortedDates.map(function (r) {
    return r.holidayName;
  }).join(","));

  var _iterator = _createForOfIteratorHelper(sortedDates),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var currentDate = _step.value;
      var isHoliday = currentDate.holiday;

      for (var i = 0; i < currentDate.numberOfSlots; i++) {
        var participant = participantsWithStats.filter(filter(currentDate)).sort(participantSorter(currentDate.start))[0];
        var participantIndex = participant && participantsWithStats.indexOf(participant);

        if (participant) {
          participant.pickedDates.push(currentDate);
          participant.numberOfDays = participant.numberOfDays + (0, _differenceInCalendarDays["default"])(currentDate.end, currentDate.start);
          participant.numberOfHolidays += isHoliday ? 1 : 0;
          participant.remainingSlots -= 1;
          currentDate.slots[i] = participantIndex;
        } else {
          console.log("could not find a participant for slot for day " + currentDate.start);
        }
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return [calendar, participantsWithStats];
};

var _default = make;
exports["default"] = _default;