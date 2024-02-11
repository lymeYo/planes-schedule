export type TflightsData<notNull = false> = {
  start: notNull extends true ? number : number | null;
  end: notNull extends true ? number : number | null;
}

export type Tschedule = {
  planeName: string;
  id: number;
  flightsData: TflightsData[];
}

export type TchartSchedule = {
  date: number,
  data: Tschedule[]
}