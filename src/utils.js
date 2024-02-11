const flightDateRegexp = new RegExp(
  /[0-9]{4}-[0-9]{2}-[0-9]{2} (0?[0-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9])/
);
export const isFlightDateValid = (value) => flightDateRegexp.test(value);

//приведение данных расписаний к виду пригодному для графиков
export const transformDataToCharts = (schedules) => {
  const filteredSchedules = schedules.map((sche) => ({
    ...sche,
    flightsData: sche.flightsData.filter(
      (flight) =>
        isFlightDateValid(flight.start) && isFlightDateValid(flight.end)
    ),
  }));
  const schedulesByDate = [];

  // [
  // {
  //   date: '',
  //   data: [
  //   {
  //     planeName: '',
  //     id: 2,
  //     flightsData = [...]
  //   }
  // }
  // ]

  const getTimeFloatByStr = (timeStr) => {
    const hours = +timeStr.split(":")[0];
    const minutes = +timeStr.split(":")[1];

    return hours + +(minutes / 60).toFixed(2);
  };

  filteredSchedules.forEach((filterSche) => {
    filterSche.flightsData.forEach((flightData) => {
      const startFlightDate = flightData.start.split(" ")[0];
      const endFlightDate = flightData.end.split(" ")[0];

      const setFlightData = (flight) => {
        const flightDate = flight.start.split(" ")[0];
        const getScheduleByDate = () =>
          schedulesByDate.find((sche) => sche.date == flightDate);
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
        scheduleByPlaneName.flightsData.push({
          timeStart: getTimeFloatByStr(flight.start.split(" ")[1]),
          timeEnd: getTimeFloatByStr(flight.end.split(" ")[1]),
        });
      };

      if (startFlightDate == endFlightDate) {
        setFlightData(flightData);
      } else {
        //разбиваю полет на 2, если он состоится в ночь с одного числа на другое
        setFlightData({
          start: flightData.start,
          end: flightData.start.split(" ")[0] + " 24:00",
        });
        setFlightData({
          start: flightData.end.split(" ")[0] + " 00:00",
          end: flightData.end,
        });
      }
    });
  });

  return schedulesByDate;
};

export const createTimeStringFromInt = (timeInt) => {
  const hours = ("0" + parseInt(timeInt)).slice(-2);
  const minutes = ("0" + Math.round(60 * (timeInt % 1))).slice(-2);
  return `${hours}:${minutes}`;
};
