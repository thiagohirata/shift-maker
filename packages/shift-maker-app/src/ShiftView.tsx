import React, { useState } from "react";
import parseISO from "date-fns/parseISO";
import format from "date-fns/format";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import { Participant } from "@thiagohirata/shift-maker/src/types";
import make from "@thiagohirata/shift-maker/src/make";
const colorArray = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#FFFF99",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
  "#66991A",
  "#FF99E6",
  "#CCFF1A",
  "#FF1A66",
  "#E6331A",
  "#33FFCC",
  "#66994D",
  "#B366CC",
  "#4D8000",
  "#B33300",
  "#CC80CC",
  "#66664D",
  "#991AFF",
  "#E666FF",
  "#4DB3FF",
  "#1AB399",
  "#E666B3",
  "#33991A",
  "#CC9999",
  "#B3B31A",
  "#00E680",
  "#4D8066",
  "#809980",
  "#E6FF80",
  "#1AFF33",
  "#999933",
  "#FF3380",
  "#CCCC00",
  "#66E64D",
  "#4D80CC",
  "#9900B3",
  "#E64D66",
  "#4DB380",
  "#FF4D4D",
  "#99E6E6",
  "#6666FF",
];

const p = (
  name,
  onlyOncePerMonth?,
  vacationDays?: [{ start: string; end: string }],
  vacationTime?: number,
  color?: string
): Participant => ({
  name,
  onlyOncePerMonth,
  color,
  vacationTime: vacationTime || 1,
  vacationDays: vacationDays
    ? vacationDays.map((r) => ({
        start: parseISO(r.start),
        end: parseISO(r.end),
      }))
    : [],
});

const ShiftView = (props): JSX.Element => {
  const [selected, setSelected] = useState<number>();
  const [[resultedCalendar, participants]] = useState(() =>
    make(
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
        p("Her", false, undefined, undefined, colorArray[0]),
        p("Sum", false, undefined, undefined, colorArray[1]),
        p("Vin", false, undefined, undefined, colorArray[2]),
        p(
          "Gab",
          false,
          [{ start: "2021-02-15", end: "2021-06-15" }],
          4,
          colorArray[3]
        ),
        p("Bru", false, undefined, undefined, colorArray[4]),
        p("Mat", false, undefined, undefined, colorArray[5]),
        p("Urs", false, undefined, undefined, colorArray[6]),
        p("Vic", false, undefined, undefined, colorArray[7]),
        p("Bar", false, undefined, undefined, colorArray[8]),
      ]
    )
  );
  return (
    <>
      <table>
        <tbody>
          {resultedCalendar.days.map((r) => {
            const duration = differenceInCalendarDays(r.end, r.start) + 1;

            return (
              <tr key={r.start.toISOString()} className="table table-sm">
                <td
                  className={
                    !r.holiday
                      ? ""
                      : duration === 1
                      ? "table-success"
                      : duration === 2
                      ? "table-info"
                      : duration === 3
                      ? "table-warning"
                      : "table-danger"
                  }
                >
                  {format(r.start, "dd/MM")} - {format(r.end, "dd/MM")}
                  {/* {r.holidayName && (
                    <div className="small text-muted">{r.holidayName}</div>
                  )} */}
                </td>

                {r.slots.map((i) => {
                  const participant = participants[i];
                  return (
                    <td
                      key={i}
                      className={
                        selected != null && r.slots.indexOf(selected) >= 0
                          ? "table-primary"
                          : ""
                      }
                    >
                      <span
                        className={selected === i ? "font-weight-bold" : ""}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelected(i);
                        }}
                      >
                        {participant.name}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <table>
        <tbody>
          <tr>
            <th>Nome</th>
            <th>Escalas</th>
            <th>Feriados</th>
            <th>Total de dias</th>
          </tr>
          {participants.map((p, idx) => {
            return (
              <tr key={idx}>
                <th>{p.name}</th>
                <td>{p.pickedDates.length}</td>
                <td>{p.numberOfHolidays}</td>
                <td>{p.numberOfDays}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ShiftView;
