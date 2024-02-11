<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { isFlightDateValid } from "../../../utils";
import InputArea from "./InputArea.vue";

const startFlight = defineModel("startFlight");
const endFlight = defineModel("endFlight");

const startFlightInput = ref("");
const endFlightInput = ref("");

const startFlightRef = ref<InstanceType<typeof InputArea> | null>(null);

onMounted(() => {
  startFlightRef.value?.inputRef?.focus(); //фокусирование на только что созданном input
});
const inputsValid = computed(() => ({
  start: isFlightDateValid(startFlightInput.value),
  end: isFlightDateValid(endFlightInput.value),
}));

watch(startFlightInput, (startValue) => {
  if (isFlightDateValid(startValue))
    startFlight.value = new Date(startValue).getTime();
});
watch(endFlightInput, (endValue) => {
  if (isFlightDateValid(endValue))
    endFlight.value = new Date(endValue).getTime();
});

const placeholderTemplate = "2023-08-02 14:30";
</script>

<template>
  <div class="inputs-row">
    <InputArea
      v-model="startFlightInput"
      :placeholder="placeholderTemplate"
      :isInvalid="Boolean(!inputsValid.start && startFlightInput.length)"
      ref="startFlightRef"
      label="Вылет:"
    />
    <InputArea
      v-model="endFlightInput"
      :placeholder="placeholderTemplate"
      :isInvalid="Boolean(!inputsValid.end && endFlightInput.length)"
      label="Посадка:"
    />
  </div>
</template>

<style scoped>
.inputs-row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

@media (max-width: 700px) {
  .inputs-row {
    position: relative;
    flex-direction: column;
    justify-content: initial;
  }
}
</style>
