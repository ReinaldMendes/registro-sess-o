<template>
  <div class="dashboard-list-card" :class="`border-${color}-500`">
    <h2 :class="`text-${color}-700`">
      <i class="fas" :class="`fa-${icon}`"></i>
      {{ title }}
    </h2>
    <ul>
      <li v-for="(item, index) in items" :key="index">
        {{ item }}
      </li>
    </ul>
    <p v-if="!items || items.length === 0" class="text-gray-500">Nenhum dado encontrado.</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: String,
  items: Array,
  color: String,
  icon: String,
})
</script>

<style scoped>
/* Estilos do card de lista para reutilização */
.dashboard-list-card {
  @apply bg-white p-6 rounded-lg shadow-md;
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-list-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.dashboard-list-card h2 {
  @apply text-xl font-bold mb-4 flex items-center gap-2;
}

.dashboard-list-card ul {
  @apply list-disc list-inside;
}

.dashboard-list-card li {
  @apply mb-2 text-gray-700;
}
</style>