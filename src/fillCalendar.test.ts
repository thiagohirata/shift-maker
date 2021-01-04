import fillCalendar from "./fillCalendar";
import parseISO from "date-fns/parseISO";

test("x", () => {
  expect(
    fillCalendar({
      startDate: parseISO("2021-01-03"),
      endDate: parseISO("2021-01-18"),
      holidays: [
        {
          startDate: parseISO("2021-01-08"),
          endDate: parseISO("2021-01-10"),
          slots: [undefined, undefined],
          holidayName: "holiday 1",
        },
        {
          startDate: parseISO("2021-01-12"),
          endDate: parseISO("2021-01-12"),
          slots: [undefined, undefined],
          holidayName: "holiday 2",
        },
      ],
      defaults: {
        numberOfSlots: 2,
      },
    })
  ).toMatchObject({
    slotCount: 8,
    slotDayCount: 14,
    days: [
      {
        startDate: parseISO("2021-01-03"),
        endDate: parseISO("2021-01-03"),
        slots: [undefined, undefined],
      },
      {
        startDate: parseISO("2021-01-08"),
        endDate: parseISO("2021-01-10"),
        holiday: true,
        slots: [undefined, undefined],
        holidayName: "holiday 1",
      },
      {
        startDate: parseISO("2021-01-12"),
        endDate: parseISO("2021-01-12"),
        holiday: true,
        slots: [undefined, undefined],
        holidayName: "holiday 2",
      },
      {
        startDate: parseISO("2021-01-16"),
        endDate: parseISO("2021-01-17"),
        slots: [undefined, undefined],
      },
    ],
  });
});
