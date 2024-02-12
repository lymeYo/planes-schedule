export type TflightsData<notNull = false> = {
  start: notNull extends true ? number : number | null;
  end: notNull extends true ? number : number | null;
}

export type Tschedule<flightsNotNull = false> = {
  planeName: string;
  id: number;
  flightsData: TflightsData<flightsNotNull>[];
}

export type TchartSchedule = {
  date: number,
  data: Tschedule<true>[]
}