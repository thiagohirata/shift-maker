import type { CalendarConfig, Calendar, DateRange, Participant } from "./types";
import fillCalendar from "./fillCalendar";
import addDays from "date-fns/addDays";
import isWithinInterval from "date-fns/isWithinInterval";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { isSameDay } from "date-fns";

interface ParticipantWithStats extends Participant {
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
    (p1: ParticipantWithStats): number => (p1.remainingSlots > 1 ? -1 : 0), //coloca na frente quem tem slots
    (p1: ParticipantWithStats): number =>
      Math.min(
        Number.MAX_VALUE,
        ...p1.pickedDates.map((pickedDate) =>
          Math.abs(differenceInCalendarDays(date, pickedDate.start))
        )
      ) > 7
        ? 0
        : 1, //está ocupado a menos de uma semana
    (p1: ParticipantWithStats): number =>
      -1 * Math.round((0.6 * p1.remainingSlots) / p1.totalSlots), // usou mais 10% slots 
    (p1: ParticipantWithStats): number =>
      -1 *
      Math.min(
        Number.MAX_VALUE,
        ...p1.pickedDates.map((pickedDate) =>
          Math.min(Math.abs(differenceInCalendarDays(date, pickedDate.start)))
        )
      ), //dias de distância para outros slots usados
    (p1: ParticipantWithStats): number =>
      -1 * Math.round((100 * p1.remainingSlots) / p1.totalSlots), // usou mais % slots 
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
    (r, participantIndex) => {
      const pickedDates = r.pickedDays
        ? r.pickedDays.map((p) =>
            calendar.days.find((d) => isSameDay(p.start, d.start))
          )
        : [];
      pickedDates.forEach(
        (p) => (p.slots[p.slots.findIndex((x) => !x)] = participantIndex)
      );
      const remainingSlots =
        (r.onlyOncePerMonth ? 0.5 : 1) *
        (12 - r.vacationTime) *
        expectedSlotsPerParticipantMonth;
      return {
        ...r,
        numberOfHolidays: pickedDates.filter((p) => p.holiday).length,
        numberOfDays: pickedDates.reduce(
          (acc, currentDate) =>
            acc + differenceInCalendarDays(currentDate.end, currentDate.start),
          0
        ),
        pickedDates,
        blockedDateRanges: [...r.vacationDays],
        totalSlots:
          (r.onlyOncePerMonth ? 0.5 : 1) *
          (12 - r.vacationTime) *
          expectedSlotsPerParticipantMonth,
        remainingSlots: remainingSlots - pickedDates?.length,
      };
    }
  );

  const sortedDates = [...calendar.days].sort(dateSorter);

  for (const currentDate of sortedDates) {
    const isHoliday = currentDate.holiday;

    for (let i = 0; i < currentDate.numberOfSlots; i++) {
      if (currentDate.slots[i]) continue;

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
