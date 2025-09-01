<template>
    <Bar :data="chartData" :options="chartOptions" />
  </template>
  
  <script setup>
  import { Bar } from 'vue-chartjs'
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
  } from 'chart.js'
  import { ref, watch } from 'vue'
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
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
  
  watch(() => props.data, (newData) => {
    if (newData && newData.length > 0) {
      chartData.value = {
        labels: newData.map(item => item.data),
        datasets: [{
          label: 'Consumo por Sessão (ml)',
          backgroundColor: '#0c7c59',
          data: newData.map(item => item.consumo),
        }]
      };
    } else {
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