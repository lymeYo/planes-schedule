<script setup>
import { computed, onMounted, ref } from "vue";
import { isFlightDateValid } from "../../../utils";
import InputArea from "./InputArea.vue";

const startFlight = defineModel("startFlight");
const endFlight = defineModel("endFlight");

const startFlightRef = ref(null);

onMounted(() => {
  startFlightRef.value.inputRef.focus(); //фокусирование на только что созданном input
});

const isStartFlightValid = computed(() => isFlightDateValid(startFlight.value));
const isEndFlightValid = computed(() => isFlightDateValid(endFlight.value));
const placeholderTemplate = "2023-08-02 14:30";
</script>

<template>
  <div class="inputs-row">
    <InputArea
      v-model="startFlight"
      :placeholder="placeholderTemplate"
      :isInvalid="Boolean(!isStartFlightValid && startFlight.length)"
      ref="startFlightRef"
      label="Вылет:"
    />
    <InputArea
      v-model="endFlight"
      :placeholder="placeholderTemplate"
      :isInvalid="Boolean(!isEndFlightValid && endFlight.length)"
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
