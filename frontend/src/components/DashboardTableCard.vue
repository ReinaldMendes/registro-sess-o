<template>
  <div class="dashboard-card-modern">
    <div class="card-header" :class="`bg-${color}-500`">
      <h2 class="card-title text-white">
        <i class="fas" :class="`fa-${icon} text-xl mr-2`"></i>
        {{ title }}
      </h2>
    </div>
    
    <div class="card-content py-4 px-4">
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
      <p v-if="!items || items.length === 0" class="text-gray-500 text-center mt-4 text-sm">Nenhum dado encontrado.</p>
    </div>
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
  @apply flex-grow p-4;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.5rem;
  font-family: 'Segoe UI', 'Roboto', sans-serif;
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
</style>