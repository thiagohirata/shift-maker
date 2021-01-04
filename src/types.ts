export interface DateRange {
  startDate: Date;
  endDate: Date;
  holiday: boolean;
  holidayName?: string;
  numberOfSlots: number;
  blacklist?: number[];
  slots: number[];
}

export interface CalendarConfig {
  startDate: Date;
  endDate: Date;
  holidays: Array<Partial<DateRange> & { holidayName: string }>;
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
  vacationDays: Array<{ startDate: Date; endDate: Date }>;
}
