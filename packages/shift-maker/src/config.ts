import type { CalendarConfig } from "./types";
import parseISO from "date-fns/parseISO";

const config: CalendarConfig = {
  start: parseISO("2021-02-01"),
  end: parseISO("2022-01-03"),
  holidays: [],
  defaults: {
    numberOfSlots: 3,
  },
};

export default config;
