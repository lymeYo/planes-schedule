const flightDateRegexp = new RegExp(
  /[0-9]{4}-[0-9]{2}-[0-9]{2} (0?[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])/
);
export const isFlightDateValid = (value) => flightDateRegexp.test(value);

export const compareDatesWithoutTime = (numDateA, numDateB) => {
  const dateA = new Date(numDateA);
  const dateB = new Date(numDateB);
  return (
    dateA.getFullYear() == dateB.getFullYear() &&
    dateA.getMonth() == dateB.getMonth() &&
    dateA.getDate() == dateB.getDate()
  );
};

//приведение данных расписаний к виду пригодному для графиков
export const transformDataToCharts = (schedules) => {
  const filteredSchedules = schedules.map((sche) => ({
    ...sche,
    flightsData: sche.flightsData.filter(
      (flight) => flight.start && flight.end && flight.start <= flight.end
    ),
  }));
  const schedulesByDate = [];

  filteredSchedules.forEach((filterSche) => {
    filterSche.flightsData.forEach((flightData) => {
      const setFlightData = (flight, flightDate) => {
        const getScheduleByDate = () =>
          schedulesByDate.find((sche) =>
            compareDatesWithoutTime(sche.date, flightDate)
          );
        if (!getScheduleByDate())
          schedulesByDate.push({ date: flightDate, data: [] });
        const scheduleByDate = getScheduleByDate();

        const getScheduleByPlaneName = () =>
          scheduleByDate.data.find(
            (sche) => sche.planeName == filterSche.planeName
          );
        if (!getScheduleByPlaneName())
          scheduleByDate.data.push({ ...filterSche, flightsData: [] });
        const scheduleByPlaneName = getScheduleByPlaneName();

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
};
