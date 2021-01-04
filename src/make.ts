import type { CalendarConfig, Calendar, DateRange, Participant } from "./types";
import fillCalendar from "./fillCalendar";

interface ParticipantWithStats extends Participant {
  numberOfWeekends: number;
  numberOfHolidays: number;
  pickedDates: DateRange[];
}



const make = (
  calendarConfig: CalendarConfig,
  participants: Participant[]
): [Calendar, ParticipantWithStats[]] => {
  const calendar = fillCalendar(calendarConfig);
  const participantsWithStats: ParticipantWithStats[] = participants.map(
    (r) => ({ ...r, numberOfHolidays: 0, numberOfWeekends: 0, pickedDates: [] })
  );

  // participante com um fds por mês = 0.5
  const participantCount = participantsWithStats.reduce(
    (acc, p) => acc + (p.onlyOncePerMonth ? 0.5 : 1),
    0
  );

  const expectedSlotsPerParticipant = calendar.slotCount / participantCount;
  console.log("Número de fins de semana: " + calendar.days.length)
  console.log({ expectedSlotsPerParticipant, participantCount });

  return [calendar, participantsWithStats];
};

export default make;
