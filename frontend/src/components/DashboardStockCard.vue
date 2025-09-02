<template>
  <div class="dashboard-card-modern">
    <div class="card-header bg-green-500">
      <h2 class="card-title text-white">
        <i class="fas fa-leaf text-xl mr-2"></i>
        {{ title }}
      </h2>
    </div>
    
    <div class="card-content flex-col items-center justify-center py-6 px-4">
      <p class="main-value text-green-700">{{ value }} ml</p>
      <p class="sub-info text-gray-500 mt-2 text-center">Última atualização: {{ formatarData(date) }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: String,
  value: [Number, String],
  date: String,
})

const formatarData = (dataStr) => {
  if (!dataStr) return 'Sem dados';
  return new Date(dataStr).toLocaleDateString("pt-BR");
};
</script>

<style scoped>
.dashboard-card-modern {
  @apply bg-white rounded-xl shadow-lg overflow-hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  min-height: 150px;
  display: flex;
  flex-direction: column;
}

.dashboard-card-modern:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  @apply text-white p-4 text-center;
}

.card-title {
  @apply text-xl font-bold flex items-center justify-center;
}

.card-content {
  @apply flex-grow;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main-value {
  @apply text-5xl font-extrabold;
}

.sub-info {
  @apply text-base;
}
</style>