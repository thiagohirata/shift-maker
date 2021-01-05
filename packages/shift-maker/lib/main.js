"use strict";

var _make3 = _interopRequireDefault(require("./make"));

var _parseISO = _interopRequireDefault(require("date-fns/parseISO"));

var _format = _interopRequireDefault(require("date-fns/format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var p = function p(name, onlyOncePerMonth, vacationDays, vacationTime) {
  return {
    name: name,
    onlyOncePerMonth: onlyOncePerMonth,
    vacationTime: vacationTime || 1,
    vacationDays: vacationDays ? vacationDays.map(function (r) {
      return {
        start: (0, _parseISO["default"])(r.start),
        end: (0, _parseISO["default"])(r.end)
      };
    }) : []
  };
};

var main = function main() {
  var _make = (0, _make3["default"])({
    start: (0, _parseISO["default"])("2021-02-01"),
    end: (0, _parseISO["default"])("2022-01-31"),
    holidays: [{
      start: (0, _parseISO["default"])("2021-01-23"),
      end: (0, _parseISO["default"])("2021-01-25"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-02-13"),
      end: (0, _parseISO["default"])("2021-02-16"),
      holidayName: "Carnaval",
      specialHoliday: true
    }, {
      start: (0, _parseISO["default"])("2021-04-02"),
      end: (0, _parseISO["default"])("2021-04-04"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-04-21"),
      end: (0, _parseISO["default"])("2021-04-21"),
      holidayName: "Tiradentes"
    }, {
      start: (0, _parseISO["default"])("2021-06-03"),
      end: (0, _parseISO["default"])("2021-06-06"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-07-09"),
      end: (0, _parseISO["default"])("2021-07-11"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-09-04"),
      end: (0, _parseISO["default"])("2021-09-07"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-10-09"),
      end: (0, _parseISO["default"])("2021-10-12"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-10-30"),
      end: (0, _parseISO["default"])("2021-11-02"),
      holidayName: "?"
    }, {
      start: (0, _parseISO["default"])("2021-12-24"),
      end: (0, _parseISO["default"])("2021-12-26"),
      holidayName: "Natal",
      specialHoliday: true
    }, {
      start: (0, _parseISO["default"])("2021-12-31"),
      end: (0, _parseISO["default"])("2022-01-02"),
      holidayName: "Ano novo",
      specialHoliday: true
    }, {
      start: (0, _parseISO["default"])("2022-01-22"),
      end: (0, _parseISO["default"])("2022-01-25"),
      holidayName: "?"
    }],
    defaults: {
      numberOfSlots: 4
    }
  }, [p("Her"), p("Sum"), p("Vin"), p("Gab", false, [{
    start: "2021-02-15",
    end: "2021-06-15"
  }], 4), p("Bru"), p("Mat"), p("Urs"), p("Vic"), p("Bar")]),
      _make2 = _slicedToArray(_make, 2),
      resultedCalendar = _make2[0],
      participants = _make2[1];

  resultedCalendar.days.forEach(function (r) {
    console.log((0, _format["default"])(r.start, "dd/MM") + "-" + (0, _format["default"])(r.end, "dd/MM") + (r.holiday ? " ##".concat(r.holidayName, "##") : ""));
    console.log(r.slots.map(function (i) {
      return participants[i] ? participants[i].name : "- vago -";
    }).join(", "));
    console.log("");
  });
  participants.forEach(function (p) {
    console.log("".concat(p.name, ": ").concat(p.numberOfDays, "; ").concat(p.pickedDates.length, "; ").concat(p.remainingSlots));
  });
};

main();