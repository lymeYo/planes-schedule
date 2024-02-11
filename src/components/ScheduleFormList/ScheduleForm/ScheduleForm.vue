<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import InputsRow from "./InputsRow.vue";
import AddButton from "./AddButton.vue";
import InputArea from "./InputArea.vue";
import { Tschedule } from "../../../types";

const emits = defineEmits<{(e: "addFlightsData", id: number): void}>();
const { schedule } = defineProps<{schedule: Tschedule}>();

const planeNameRef = ref<InstanceType<typeof InputArea> | null>(null);

onMounted(() => {
  planeNameRef.value?.inputRef.focus(); //фокусирование на только что созданном input
});
</script>

<template>
  <div class="form">
    <div class="form-header">
      <InputArea
        v-model="schedule.planeName"
        ref="planeNameRef"
        label="Бортовой номер"
        isMain
      />
    </div>
    <div class="form-inputs">
      <InputsRow
        v-for="(flightsData, ind) in schedule.flightsData"
        v-model:startFlight="flightsData.start"
        v-model:endFlight="flightsData.end"
        :key="ind"
      />
    </div>

    <AddButton
      @click="emits('addFlightsData', schedule.id)"
      text="Добавить перелет"
    />
  </div>
</template>

<style scoped>
.form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 2px solid var(--main-clr);
  padding: 15px;
  box-sizing: border-box;
  border-radius: 8px;
  background-color: var(--bg-second-clr);
}

.form-header {
  margin-bottom: 15px;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.add-plane-btn {
  margin-top: 20px;
}

@media (max-width: 700px) {
  .form-inputs {
    gap: 30px;
  }

  .inputs-row {
    position: relative;
  }

  .inputs-row::before {
    content: "";
    width: 100%;
    height: 1px;
    background-color: var(--bg-clr);
    position: absolute;
    top: -15px;
  }
}

@media (max-width: 470px) {
  .form-header > * {
    flex-direction: column;
  }
}
</style>
