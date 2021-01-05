import make from "./make";
import { Participant } from "./types";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";

const p = (
  name,
  onlyOncePerMonth?,
  vacationDays?: [{ start: string; end: string }],
  vacationTime?: number
): Participant => ({
  name,
  onlyOncePerMonth,
  vacationTime: vacationTime || 1,
  vacationDays: vacationDays
    ? vacationDays.map((r) => ({
        start: parseISO(r.start),
        end: parseISO(r.end),
      }))
    : [],
});

const main = () => {
  const [resultedCalendar, participants] = make(
    {
      start: parseISO("2021-02-01"),
      end: parseISO("2022-01-31"),
      holidays: [
        {
          start: parseISO("2021-01-23"),
          end: parseISO("2021-01-25"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-02-13"),
          end: parseISO("2021-02-16"),
          holidayName: "Carnaval",
          specialHoliday: true,
        },
        {
          start: parseISO("2021-04-02"),
          end: parseISO("2021-04-04"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-04-21"),
          end: parseISO("2021-04-21"),
          holidayName: "Tiradentes",
        },
        {
          start: parseISO("2021-06-03"),
          end: parseISO("2021-06-06"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-07-09"),
          end: parseISO("2021-07-11"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-09-04"),
          end: parseISO("2021-09-07"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-10-09"),
          end: parseISO("2021-10-12"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-10-30"),
          end: parseISO("2021-11-02"),
          holidayName: "?",
        },
        {
          start: parseISO("2021-12-24"),
          end: parseISO("2021-12-26"),
          holidayName: "Natal",
          specialHoliday: true,
        },
        {
          start: parseISO("2021-12-31"),
          end: parseISO("2022-01-02"),
          holidayName: "Ano novo",
          specialHoliday: true,
        },
        {
          start: parseISO("2022-01-22"),
          end: parseISO("2022-01-25"),
          holidayName: "?",
        },
      ],
      defaults: {
        numberOfSlots: 4,
      },
    },
    [
      p("Her"),
      p("Sum"),
      p("Vin"),
      p("Gab", false, [{ start: "2021-02-15", end: "2021-06-15" }], 4),
      p("Bru"),
      p("Mat"),
      p("Urs"),
      p("Vic"),
      p("Bar"),
    ]
  );

  resultedCalendar.days.forEach((r) => {
    console.log(
      format(r.start, "dd/MM") +
        "-" +
        format(r.end, "dd/MM") +
        (r.holiday ? ` ##${r.holidayName}##` : "")
    );
    console.log(
      r.slots
        .map((i) => (participants[i] ? participants[i].name : "- vago -"))
        .join(", ")
    );
    console.log("");
  });

  participants.forEach((p) => {
    console.log(
      `${p.name}: ${p.numberOfDays}; ${p.pickedDates.length}; ${p.remainingSlots}`
    );
  });
};

main();
