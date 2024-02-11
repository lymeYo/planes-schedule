<script setup>
import { computed, reactive, watch } from "vue";
import ScheduleFormList from "./components/ScheduleFormList/ScheduleFormList.vue";
import ScheduleChart from "./components/ScheduleChart/ScheduleChart.vue";
import { isFlightDateValid, transformDataToCharts } from "./utils";
let id = 0;

const schedules = reactive([
  {
    planeName: "G-42" + id,
    id: id++,
    flightsData: [
      { start: "2024-02-09 13:00", end: "2024-02-09 17:00" },
      { start: "2024-02-09 18:00", end: "2024-02-09 19:00" },
      { start: "2024-02-10 22:00", end: "2024-02-11 02:00" },
    ],
  },
]);

const addSchedule = () => {
  const newSchedule = { planeName: "", id: id++, flightsData: [] };
  schedules.push(newSchedule);
};

const addFlightsData = (scheduleId) => {
  schedules
    .find((s) => s.id == scheduleId)
    ?.flightsData.push({ start: "", end: "" });
};

//разбиение данных по датам
const schedulesForCharts = computed(() => transformDataToCharts(schedules));
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
