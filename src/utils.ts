import { TchartSchedule, TflightsData, Tschedule, isFlightDataNotNull } from "./types";

const flightDateRegexp = new RegExp(
  /[0-9]{4}-[0-9]{2}-[0-9]{2} (0?[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])/
);
export const isFlightDateValid = (value: string) =>
  flightDateRegexp.test(value);

export const compareDatesWithoutTime = (numDateA: number, numDateB: number) => {
  const dateA = new Date(numDateA);
  const dateB = new Date(numDateB);
  return (
    dateA.getFullYear() == dateB.getFullYear() &&
    dateA.getMonth() == dateB.getMonth() &&
    dateA.getDate() == dateB.getDate()
  );
};

//приведение данных расписаний к виду пригодному для графиков
export const transformDataToCharts = (schedules: Tschedule[]) => {
  const schedulesByDate: TchartSchedule[] = [];

  schedules.forEach((schedule) => {
    schedule.flightsData.forEach((flightData) => {
      if (!(isFlightDataNotNull(flightData) && flightData.start <= flightData.end)) return
      
      const setFlightData = (
        flight: TflightsData<true>,
        flightDate: number
      ) => {
        let scheduleByDate = schedulesByDate.find((sche) =>
          compareDatesWithoutTime(sche.date, flightDate)
        );

        if (!scheduleByDate) {
          scheduleByDate = { date: flightDate, data: [] };
          schedulesByDate.push(scheduleByDate);
        }

        let scheduleByPlaneName = scheduleByDate.data.find(
          (sche) => sche.planeName == schedule.planeName
        );

        if (!scheduleByPlaneName) {
          scheduleByPlaneName = { ...schedule, flightsData: [] };
          scheduleByDate.data.push(scheduleByPlaneName);
        }

        scheduleByPlaneName.flightsData.push(flight);
      };
      
      if (compareDatesWithoutTime(flightData.start, flightData.end)) {
        setFlightData(flightData, flightData.start);
      } else {
        //разбиваю полет на 2, если он состоится в ночь с одного числа на другое
        setFlightData(flightData, flightData.start);
        setFlightData(flightData, flightData.end);
      }
    });
  });

  return schedulesByDate;
}