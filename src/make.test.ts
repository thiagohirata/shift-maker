import make from "./make";
import { Participant } from "./types";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format"

const p = (name, onlyOncePerMonth?): Participant => ({
  name,
  onlyOncePerMonth,
  vacationDays: [],
});

test("make test", () => {
  const [resultedCalendar, participants] = make(
    {
      startDate: parseISO("2020-02-01"),
      endDate: parseISO("2021-01-31"),
      holidays: [],
      defaults: {
        numberOfSlots: 3,
      },
    },
    [
      p("A"),
      p("B"),
      p("C"),
      p("D"),
      p("E"),
      p("F"),
      p("G"),
      p("H"),
      p("I", true),
      p("J", true),
    ]
  );

  console.log(resultedCalendar.days.map(r => format(r.startDate, "dd/MM")))
});
