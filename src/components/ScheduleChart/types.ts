export type TdatasetData = [number, number, { startForLabel: string, endForLabel: string }]

export type Tdataset = {
  data: TdatasetData[],
  backgroundColor: string,
  barThickness: number
}