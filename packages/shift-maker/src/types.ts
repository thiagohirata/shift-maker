export interface DateRange {
  start: Date;
  end: Date;
  holiday: boolean;
  specialHoliday?: boolean;
  holidayName?: string;
  nextALongHoliday: boolean;
  numberOfSlots: number;
  blacklist?: number[];
  slots: number[];
}

export interface Holiday
  extends Partial<Omit<DateRange, "start" | "end" | "holidayName">> {
  holidayName?: string;
  specialHoliday?: boolean;
  start: Date;
  end: Date;
}

export interface CalendarConfig {
  start: Date;
  end: Date;
  holidays: Holiday[];
  defaults?: Partial<DateRange>;
}

export interface Calendar {
  days: DateRange[];
  slotCount: number;
  slotDayCount: number;
}

export interface Participant {
  name: string;
  onlyOncePerMonth: boolean;
  vacationTime: number;
  vacationDays: Array<{ start: Date; end: Date }>;
}
