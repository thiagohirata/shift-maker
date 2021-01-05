import fillCalendar from "./fillCalendar";
import parseISO from "date-fns/parseISO";

test("x", () => {
  expect(
    fillCalendar({
      start: parseISO("2021-01-03"),
      end: parseISO("2021-01-24"),
      holidays: [
        {
          start: parseISO("2021-01-08"),
          end: parseISO("2021-01-10"),
          slots: [undefined, undefined],
          holidayName: "holiday 1",
        },
        {
          start: parseISO("2021-01-12"),
          end: parseISO("2021-01-12"),
          slots: [undefined, undefined],
          holidayName: "holiday 2",
        },
        {
          start: parseISO("2021-01-16"),
          end: parseISO("2021-01-18"),
          slots: [undefined, undefined],
          holidayName: "holiday 3",
        },
      ],
      defaults: {
        numberOfSlots: 2,
      },
    })
  ).toMatchObject({
    slotCount: 10,
    slotDayCount: 20,
    days: [
      {
        start: parseISO("2021-01-03"),
        end: parseISO("2021-01-03"),
        slots: [undefined, undefined],
      },
      {
        start: parseISO("2021-01-08"),
        end: parseISO("2021-01-10"),
        holiday: true,
        slots: [undefined, undefined],
        holidayName: "holiday 1",
      },
      {
        start: parseISO("2021-01-12"),
        end: parseISO("2021-01-12"),
        holiday: true,
        slots: [undefined, undefined],
        holidayName: "holiday 2",
      },
      {
        start: parseISO("2021-01-16"),
        end: parseISO("2021-01-18"),
        holiday: true,
        slots: [undefined, undefined],
        holidayName: "holiday 3",
      },
      {
        start: parseISO("2021-01-23"),
        end: parseISO("2021-01-24"),
        slots: [undefined, undefined],
      },
    ],
  });
});
