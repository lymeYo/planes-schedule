<script setup>
const emits = defineEmits(["click"]); //TODO првоерить с click
defineProps(["text"]);
</script>

<template>
  <button class="add-plane-btn" @click="emits('click')">
    {{ text }}
  </button>
</template>

<style scoped>
.add-plane-btn {
  border: 2px solid var(--main-clr);
  background-color: var(--bg-second-clr);
  width: fit-content;
  padding: 7px 12px;
  border-radius: 5px;
  transition: background-color 0.2s, color 0.2s;
}

.add-plane-btn:hover {
  color: var(--bg-second-clr);
  background-color: var(--main-clr);
}
</style>
