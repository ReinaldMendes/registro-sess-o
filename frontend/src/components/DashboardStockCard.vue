<template>
    <div class="dashboard-stock-card" :class="`border-${color}-500`">
      <div class="header-content">
        <h2 :class="`text-${color}-700`">
          <i class="fas" :class="`fa-${icon}`"></i>
          {{ title }}
        </h2>
      </div>
      
      <div class="main-content">
        <p class="value-text">{{ value }} ml</p>
        <p class="date-text">Última atualização: {{ formatarData(date) }}</p>
      </div>
  
      <p v-if="value === null" class="text-gray-500 text-center mt-4">Nenhum dado encontrado.</p>
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
    @apply bg-white p-6 rounded-lg shadow-xl;
    border-left: 5px solid;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  .dashboard-stock-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  }
  
  .header-content {
    @apply flex justify-between items-center mb-4;
  }
  
  .dashboard-stock-card h2 {
    @apply text-xl font-bold flex items-center gap-2;
  }
  
  .main-content {
    @apply flex flex-col items-center text-center;
  }
  
  .value-text {
    @apply text-5xl font-extrabold text-gray-900;
  }
  
  .date-text {
    @apply text-sm text-gray-500 mt-2;
  }
  </style>