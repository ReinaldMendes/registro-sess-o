<template>
  <div class="dashboard-stock-card">
    <div class="total-card">
      <div class="header-card">
        <div class="icon-circle" :class="`bg-${color}-500`">
          <i class="fas" :class="`fa-${icon} text-white`"></i>
        </div>
        <h2 class="title-card">{{ title }}</h2>
      </div>

      <p class="value-card">{{ value }} ml</p>
      <p class="date-card">Última atualização: {{ formatarData(date) }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  date: String,
  color: String,
  icon: String,
})

const formatarData = (dataStr) => {
  if (!dataStr) return 'Sem dados';
  return new Date(dataStr).toLocaleDateString("pt-BR");
};
</script>

<style scoped>
.dashboard-stock-card {
  @apply bg-transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.total-card {
  @apply bg-white rounded-xl shadow-lg p-6;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.total-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.header-card {
  @apply flex items-center justify-center mb-4;
  gap: 1rem;
}

.icon-circle {
  @apply w-12 h-12 rounded-full flex items-center justify-center;
}

.title-card {
  @apply text-xl font-bold text-gray-800;
  margin: 0;
}

.value-card {
  @apply text-5xl font-extrabold text-green-600;
  margin: 0.5rem 0;
}

.date-card {
  @apply text-sm text-gray-500;
  margin-top: 0.5rem;
}
</style>