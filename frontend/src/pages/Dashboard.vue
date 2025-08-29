<template>
  <PrivateLayout>
    <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Dashboard 📊</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard title="Estoque Atual de Vegetal" color="green" icon="leaf">
          <p class="text-2xl font-semibold text-center text-green-700">{{ estoqueVegetal }} ml</p>
        </DashboardCard>
      </div>

      <template>
  <PrivateLayout>
    <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md max-w-full">
          <h2 class="text-xl font-bold text-gray-700 mb-4">Consumo de Vegetal por Sessão</h2>
          <LineChart 
            v-if="consumoData.length" 
            :data="consumoData" 
            class="h-64" 
          />
          <p v-else class="text-gray-500 text-center">Nenhum dado de consumo disponível.</p>
        </div>
      </div>
      
      </div>
  </PrivateLayout>
</template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardListCard title="5 Últimos Mestres Dirigentes" :items="ultimosMestres" color="blue" icon="crown" />
        
        <DashboardListCard title="5 Últimos a Ler Documentos" :items="ultimosLeitores" color="purple" icon="file-alt" />
        
        <DashboardListCard title="5 Últimos a Explanar" :items="ultimosExplanadores" color="orange" icon="comment-dots" />
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PrivateLayout from '../components/PrivateLayout.vue'
import DashboardCard from '../components/DashboardCard.vue'
import DashboardListCard from '../components/DashboardListCard.vue' // Corrigido
import LineChart from '../components/LineChart.vue'

const API = import.meta.env.VITE_API_URL

const estoqueVegetal = ref(0)
const ultimosMestres = ref([])
const ultimosExplanadores = ref([])
const ultimosLeitores = ref([])
const consumoData = ref([])

const setupAuth = () => {
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    // Redireciona para o login se não houver token
    // (Opcional, mas boa prática para segurança)
    console.error('Nenhum token encontrado, redirecionando para o login.')
    // window.location.href = '/login'; 
  }
}

const carregarDashboard = async () => {
  setupAuth(); // Garante que o header de autenticação está definido

  try {
    const { data: stats } = await axios.get(`${API}/api/sessoes/dashboard/stats`);
    estoqueVegetal.value = stats.estoqueAtual;

    const { data: mestres } = await axios.get(`${API}/api/sessoes/dashboard/ultimos-dirigentes`);
    ultimosMestres.value = mestres;

    const { data: explanadores } = await axios.get(`${API}/api/sessoes/dashboard/ultimos-explanadores`);
    ultimosExplanadores.value = explanadores;

    const { data: leitores } = await axios.get(`${API}/api/sessoes/dashboard/ultimos-leitores`);
    ultimosLeitores.value = leitores;

    const { data: consumo } = await axios.get(`${API}/api/sessoes/dashboard/consumo-medio`);
    console.log("Dados de consumo recebidos:", consumo);
    console.log("Tipo dos dados de consumo:", typeof consumo);

    consumoData.value = consumo;

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err)
  }
}

onMounted(() => {
  carregarDashboard()
})
</script>

<style scoped>
/* Estilos existentes */
h1 {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.dashboard-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

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