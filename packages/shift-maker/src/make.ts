import type { CalendarConfig, Calendar, DateRange, Participant } from "./types";
import fillCalendar from "./fillCalendar";
import addDays from "date-fns/addDays";
import isWithinInterval from "date-fns/isWithinInterval";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";

interface ParticipantWithStats extends Participant {
  numberOfWeekends: number;
  numberOfHolidays: number;
  numberOfDays: number;
  remainingSlots: number;
  totalSlots: number;
  pickedDates: DateRange[];
  blockedDateRanges: Array<{ start: Date; end: Date }>;
}

const dateSorter = (d1: DateRange, d2: DateRange) => {
  return [
    (d: DateRange): number => (d.specialHoliday ? -1 : 0),
    (d: DateRange): number => -1 * differenceInCalendarDays(d.end, d.start) + 1,
    (d: DateRange): number => (d.nextALongHoliday ? -1 : 0),
    (d: DateRange): number => d.start.getTime(),
  ].reduce((acc, fn) => (acc !== 0 ? acc : fn(d1) - fn(d2)), 0);
};

const filter = (currentDate: DateRange) => (p: ParticipantWithStats) => {
  if (
    p.blockedDateRanges.find(
      (r) =>
        isWithinInterval(currentDate.start, r) ||
        isWithinInterval(currentDate.end, r)
    ) ||
    p.pickedDates.find(
      (r) =>
        isWithinInterval(currentDate.start, r) ||
        isWithinInterval(currentDate.end, r)
    )
  ) {
    return false;
  }
  return true;
};

const participantSorter = (date: Date) => (
  p1: ParticipantWithStats,
  p2: ParticipantWithStats
): number => {
  return [
    (p1: ParticipantWithStats): number => (p1.remainingSlots > 1 ? -1 : 0),
    (p1: ParticipantWithStats): number =>
      Math.round(
        -0.5 *
          Math.min(
            Number.MAX_VALUE,
            ...p1.pickedDates.map((pickedDate) =>
              Math.min(
                Math.abs(differenceInCalendarDays(date, pickedDate.start))
              )
            )
          )
      ),
    (p1: ParticipantWithStats): number =>
      -1 * Math.round((0.6 * p1.remainingSlots) / p1.totalSlots),
    (p1: ParticipantWithStats): number =>
      -1 *
      Math.min(
        Number.MAX_VALUE,
        ...p1.pickedDates.map((pickedDate) =>
          Math.min(Math.abs(differenceInCalendarDays(date, pickedDate.start)))
        )
      ),
    (p1: ParticipantWithStats): number =>
      -1 * Math.round((100 * p1.remainingSlots) / p1.totalSlots),
    (p1: ParticipantWithStats): number => p1.pickedDates.length,
    (p1: ParticipantWithStats): number => p1.numberOfDays,
  ].reduce((acc, fn) => (acc !== 0 ? acc : fn(p1) - fn(p2)), 0);
};

const make = (
  calendarConfig: CalendarConfig,
  participants: Participant[]
): [Calendar, ParticipantWithStats[]] => {
  const calendar = fillCalendar(calendarConfig);

  const participantMonthCount = participants.reduce(
    (acc, r) => acc + (r.onlyOncePerMonth ? 0.5 : 1) * (12 - r.vacationTime),
    0
  );

  const expectedSlotsPerParticipantMonth =
    calendar.slotCount / participantMonthCount;

  const participantsWithStats: ParticipantWithStats[] = participants.map(
    (r) => ({
      ...r,
      numberOfHolidays: 0,
      numberOfWeekends: 0,
      numberOfDays: 0,
      pickedDates: [],
      blockedDateRanges: [...r.vacationDays],
      totalSlots:
        (r.onlyOncePerMonth ? 0.5 : 1) *
        (12 - r.vacationTime) *
        expectedSlotsPerParticipantMonth,
      remainingSlots:
        (r.onlyOncePerMonth ? 0.5 : 1) *
        (12 - r.vacationTime) *
        expectedSlotsPerParticipantMonth,
    })
  );

  const sortedDates = [...calendar.days].sort(dateSorter);
  console.log(sortedDates.map((r) => r.holidayName).join(","));

  for (const currentDate of sortedDates) {
    const isHoliday = currentDate.holiday;

    for (let i = 0; i < currentDate.numberOfSlots; i++) {
      const participant = participantsWithStats
        .filter(filter(currentDate))
        .sort(participantSorter(currentDate.start))[0];
      const participantIndex =
        participant && participantsWithStats.indexOf(participant);
      if (participant) {
        participant.pickedDates.push(currentDate);

        participant.numberOfDays =
          participant.numberOfDays +
          differenceInCalendarDays(currentDate.end, currentDate.start);
        participant.numberOfHolidays += isHoliday ? 1 : 0;
        participant.remainingSlots -= 1;

        currentDate.slots[i] = participantIndex;
      } else {
        console.log(
          "could not find a participant for slot for day " + currentDate.start
        );
      }
    }
  }

  return [calendar, participantsWithStats];
};

export default make;
