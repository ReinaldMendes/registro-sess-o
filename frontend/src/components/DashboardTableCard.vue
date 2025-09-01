<template>
    <div class="dashboard-table-card" :class="`border-${color}-500`">
      <h2 :class="`text-${color}-700`">
        <i class="fas" :class="`fa-${icon}`"></i>
        {{ title }}
      </h2>
      <div class="table-wrapper">
        <table class="data-table">
          <tbody>
            <tr v-for="(item, index) in items" :key="index">
              <td class="name">{{ item.nome }}</td>
              <td class="date">{{ formatarData(item.data) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!items || items.length === 0" class="text-gray-500 text-center mt-4">Nenhum dado encontrado.</p>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  
  const props = defineProps({
    title: String,
    items: Array,
    color: String,
    icon: String,
  })
  
  const formatarData = (dataStr) => {
    return new Date(dataStr).toLocaleDateString("pt-BR");
  };
  </script>
  
  <style scoped>
  .dashboard-table-card {
    @apply bg-white p-6 rounded-lg shadow-md;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .dashboard-table-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  }
  
  .dashboard-table-card h2 {
    @apply text-xl font-bold mb-4 flex items-center gap-2;
  }
  
  .table-wrapper {
    overflow-x: auto;
  }
  
  .data-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 0.5rem; /* Espaçamento entre as linhas */
  }
  
  .data-table tbody tr {
    @apply bg-gray-50 rounded-lg;
    transition: background-color 0.2s;
  }
  
  .data-table tbody tr:hover {
    @apply bg-gray-100;
  }
  
  .data-table td {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid #e5e7eb;
  }
  
  .data-table td.name {
    font-weight: 500;
    color: #333;
  }
  
  .data-table td.date {
    font-weight: 400;
    color: #666;
    text-align: right;
    font-size: 0.9rem;
  }
  
  @media (max-width: 768px) {
    .data-table {
      white-space: nowrap; /* Evita quebra de linha em telas pequenas */
    }
  }
  </style>