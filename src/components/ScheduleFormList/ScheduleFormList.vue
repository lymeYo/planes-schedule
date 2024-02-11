<script setup>
import AddButton from "./ScheduleForm/AddButton.vue";
import ScheduleForm from "./ScheduleForm/ScheduleForm.vue";

const emits = defineEmits(["addFlightsData", "addSchedule"]);
const { schedules } = defineProps(["schedules"]);

const addFlightsData = (id) => {
  emits("addFlightsData", id);
};
</script>

<template>
  <div class="schedules-list-container">
    <div class="schedules-list-wrapper">
      <ul v-if="schedules.length" class="schedules-list">
        <li v-for="schedule in schedules" :key="schedule.id">
          <ScheduleForm :schedule="schedule" @addFlightsData="addFlightsData" />
        </li>
      </ul>
      <p v-else>Нет графика расписаний</p>
      <AddButton
        text="Добавить воздушное судно"
        @click="emits('addSchedule')"
      />
    </div>
  </div>
</template>

<style scoped>
.schedules-list-container {
  padding: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.schedules-list-wrapper {
  width: 100%;
  max-width: 700px;
}

.schedules-list {
  display: flex;
  width: 100%;
  padding: 5px 0;
  gap: 18px;
  flex-direction: column;
  overflow-y: auto;
  max-height: 85vh;
}

.add-plane-btn {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .schedules-list {
    max-height: initial;
  }
}
</style>
