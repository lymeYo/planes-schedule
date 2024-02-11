<script setup>
import { onMounted, ref } from "vue";

const model = defineModel();

defineProps({
  label: String,
  isMain: Boolean,
  placeholder: String,
  isInvalid: Boolean,
});

const inputRef = ref(null);
defineExpose({ inputRef });
</script>

<template>
  <div class="input-area" :class="{ bold: isMain }">
    <label>{{ label }}</label>
    <input
      v-model="model"
      :placeholder="placeholder"
      @input="handleInputDate"
      :class="{ invalid: isInvalid }"
      required
      ref="inputRef"
      type="text"
    />
  </div>
</template>

<style scoped>
.input-area {
  display: flex;
  gap: 10px;
}

.invalid {
  border: 2px solid var(--danger-clr);
}

.input-area.bold label {
  font-weight: 600;
}

label {
  font-size: 16px;
}

input {
  border: 2px solid var(--main-clr);
  font-size: 16px;
  width: 100%;
  max-width: 200px;
}

input:focus {
  outline: none;
}

input:focus-visible {
  outline: 1px solid var(--text-clr);
}
</style>
