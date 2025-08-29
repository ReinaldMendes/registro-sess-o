<template>
  <Line :data="chartData" :options="chartOptions" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { ref, watch } from 'vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
})

const chartData = ref({
  labels: [],
  datasets: [{
    label: 'Consumo por Sessão (ml)',
    backgroundColor: '#0c7c59',
    borderColor: '#0c7c59',
    data: [],
  }],
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Consumo (ml)'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Data da Sessão'
      }
    }
  }
})

// O watcher agora é mais robusto
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    chartData.value = {
      labels: newData.map(item => item.data),
      datasets: [{
        label: 'Consumo por Sessão (ml)',
        backgroundColor: '#0c7c59',
        borderColor: '#0c7c59',
        tension: 0.4, // Suaviza a linha do gráfico
        data: newData.map(item => item.consumo),
      }]
    };
  } else {
    // Limpa os dados se o array estiver vazio para evitar problemas
    chartData.value = {
      labels: [],
      datasets: [{
        label: 'Consumo por Sessão (ml)',
        data: [],
      }]
    };
  }
}, { immediate: true, deep: true });
</script>