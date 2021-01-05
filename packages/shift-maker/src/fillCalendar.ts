import type { CalendarConfig, Calendar, DateRange } from "./types";
import getDay from "date-fns/getDay";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import isWithinInterval from "date-fns/isWithinInterval";

const firstDay = (startDate: Date, firstHoliday?: Date): Date => {
  const dowStartDate = getDay(startDate);

  if (dowStartDate === 0 || dowStartDate === 6) return startDate;
  const result = addDays(startDate, 6 - dowStartDate);
  if (firstHoliday && isBefore(firstHoliday, result)) return firstHoliday;
  return result;
};

const loop = <T>(size: number): Array<T> => {
  const arr: T[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(undefined);
  }
  return arr;
};

const fillCalendar = (config: CalendarConfig): Calendar => {
  const calendar: Partial<Calendar> = {};
  const { start: startDate, end: endDate, defaults } = config;
  const days: DateRange[] = [];
  const holidays = config.holidays || [];

  let nextHoliday = holidays.shift();
  let currentDay = firstDay(startDate, nextHoliday?.start);

  while (isBefore(currentDay, endDate)) {
    const dow = getDay(currentDay);

    const numberOfSlots = defaults?.numberOfSlots || 3;
    const isNextHoliday =
      nextHoliday && isWithinInterval(currentDay, nextHoliday);

    const endDate = isNextHoliday
      ? nextHoliday.end
      : dow === 0
      ? currentDay
      : addDays(currentDay, 1);
    days.push({
      ...defaults,
      ...(isNextHoliday ? nextHoliday : {}),
      numberOfSlots,
      start: currentDay,
      end: endDate,
      holiday: isNextHoliday,
      slots: loop(numberOfSlots),
      nextALongHoliday: undefined,
    });

    if (isNextHoliday) {
      nextHoliday = holidays.shift();
    }

    currentDay = addDays(endDate, 1 + (5 - getDay(endDate)));

    if (nextHoliday && isBefore(nextHoliday.start, currentDay)) {
      currentDay = nextHoliday.start;
    }
  }

  for (let i = 0; i < days.length; i++) {
    const { start, end } = days[i];
    if (differenceInCalendarDays(end, start) > 1) {
      if (days[i - 1]) days[i - 1].nextALongHoliday = true;
      if (days[i + 1]) days[i + 1].nextALongHoliday = true;
    }
  }

  calendar.days = days;
  let slotCount = 0,
    slotDaysCount = 0;
  for (const day of days) {
    slotCount += day.numberOfSlots;
    slotDaysCount +=
      day.numberOfSlots * (1 + differenceInCalendarDays(day.end, day.start));
  }
  calendar.slotCount = slotCount;
  calendar.slotDayCount = slotDaysCount;

  return calendar as Calendar;
};

export default fillCalendar;
