export type TflightsData = {
  start: number | null;
  end: number | null;
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