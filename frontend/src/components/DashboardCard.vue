<template>
  <div class="dashboard-card" :class="`border-${color}-500`">
    <div class="card-icon-container" :class="`bg-${color}-500`">
      <i class="fas" :class="`fa-${icon} text-3xl`"></i>
    </div>
    <h3 class="card-title" :class="`text-${color}-700`">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: String,
  color: String,
  icon: String,
});
</script>

<style scoped>
.dashboard-card {
  @apply bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center;
  border-left: 5px solid;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-icon-container {
  @apply w-16 h-16 rounded-full flex items-center justify-center text-white;
}

.card-title {
  @apply text-xl font-semibold mt-4 mb-2;
}
</style>