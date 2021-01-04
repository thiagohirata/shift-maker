import type { CalendarConfig, Calendar, DateRange } from "./types";
import getDay from "date-fns/getDay";
import isBefore from "date-fns/isBefore";
import addDays from "date-fns/addDays";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { getDate } from "date-fns";

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
  const { startDate, endDate, defaults } = config;
  const days: DateRange[] = [];
  const holidays: Partial<DateRange>[] = config.holidays || [];

  let nextHoliday: Partial<DateRange> = holidays.shift();
  let currentDay = firstDay(startDate, nextHoliday?.startDate);

  while (isBefore(currentDay, endDate)) {
    const dow = getDay(currentDay);

    const numberOfSlots = defaults?.numberOfSlots || 3;
    const isNextHoliday = currentDay === nextHoliday?.startDate;

    const endDate = isNextHoliday
      ? nextHoliday.endDate
      : dow === 0
      ? currentDay
      : addDays(currentDay, 1);
    days.push({
      ...defaults,
      ...(isNextHoliday ? nextHoliday : {}),
      numberOfSlots,
      startDate: currentDay,
      endDate,
      holiday: isNextHoliday,
      slots: loop(numberOfSlots),
    });

    if (isNextHoliday) {
      nextHoliday = holidays.shift();
    }

    currentDay = addDays(endDate, 1 + (5 - getDay(endDate)));

    if (nextHoliday && isBefore(nextHoliday.startDate, currentDay)) {
      currentDay = nextHoliday.startDate;
    }
  }

  calendar.days = days;
  let slotCount = 0,
    slotDaysCount = 0;
  for (const day of days) {
    slotCount += day.numberOfSlots;
    slotDaysCount +=
      day.numberOfSlots *
      (1 + differenceInCalendarDays(day.endDate, day.startDate));
  }
  calendar.slotCount = slotCount;
  calendar.slotDayCount = slotDaysCount;

  return calendar as Calendar;
};

export default fillCalendar;
