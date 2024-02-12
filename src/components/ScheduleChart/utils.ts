import { TflightsData } from "../../types";
import { compareDatesWithoutTime } from "../../utils";
import { TdatasetData } from "./types";

export const createDataFromFlightDates = (flight: TflightsData | TflightsData<true>, curDateStr: string): TdatasetData | null => {
  if (!flight.start || !flight.end) return null
  const curDate = new Date(curDateStr);
  
  const startTimeNum = createTimeNumFromDate(new Date(flight.start))
  const startTimeStr = createTimeStringFromNum(startTimeNum)
  const endTimeNum = createTimeNumFromDate(new Date(flight.end))
  const endTimeStr = createTimeStringFromNum(endTimeNum)

  const labelInfo = { startForLabel: startTimeStr, endForLabel: endTimeStr }
  
  if (compareDatesWithoutTime(flight.start, flight.end)) {
    return [startTimeNum, endTimeNum, labelInfo];
  } else {
    //разделение полета на два, если он происходит в ночь с одного дня на другой
    if (compareDatesWithoutTime(flight.start, curDate.getTime()))
      return [startTimeNum, 24, labelInfo];
    else if (compareDatesWithoutTime(flight.end, curDate.getTime()))
      return [0, endTimeNum, labelInfo];
    else return null;
  }
};



export const createTimeNumFromDate = (date: Date) => date.getHours() + +(date.getMinutes() / 60).toFixed(2);

export const createTimeStringFromNum = (timeNum: number) => {
  const hours = ("0" + Math.floor(timeNum)).slice(-2);
  const minutes = ("0" + Math.round(60 * (timeNum % 1))).slice(-2);
  return `${hours}:${minutes}`;
};
