<script setup>
import { computed, reactive, watch } from "vue";
import ScheduleFormList from "./components/ScheduleFormList/ScheduleFormList.vue";
import ScheduleChart from "./components/ScheduleChart/ScheduleChart.vue";
import { isFlightDateValid, transformDataToCharts } from "./utils";
let id = 0;

const schedules = reactive([]);

const addSchedule = () => {
  const newSchedule = { planeName: "", id: id++, flightsData: [] };
  schedules.push(newSchedule);
};

const addFlightsData = (scheduleId) => {
  schedules
    .find((s) => s.id == scheduleId)
    ?.flightsData.push({ start: null, end: null });
};

//разбиение данных по датам
const schedulesForCharts = computed(() => transformDataToCharts(schedules));

// fetch(
//   "https://api.travelpayouts.com/aviasales/v3/prices_for_dates?origin=MAD&destination=BCN&departure_at=2023-07&return_at=2023-08&unique=false&sorting=price&direct=false&cy=usd&limit=30&page=1&one_way=true&token=9e6e33b030dbd7711e2eb9b87ccd3e07",
//   {
//     method: "GET",
//     mode: "cors",
//     headers: { "x-access-token": "9e6e33b030dbd7711e2eb9b87ccd3e07" },
//   }
// ).then((res) => {
//   console.log(res);
// });
</script>

<template>
  <div class="container">
    <ScheduleFormList
      @addFlightsData="addFlightsData"
      @addSchedule="addSchedule"
      :schedules="schedules"
    />

    <ul class="charts">
      <li v-for="schedule in schedulesForCharts" :key="schedule.date">
        <ScheduleChart :dateTitle="schedule.date" :data="schedule.data" />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.charts {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
</style>
