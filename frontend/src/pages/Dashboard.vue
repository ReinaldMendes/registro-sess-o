<template>
  <PrivateLayout>
    <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Dashboard 📊</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardStockCard 
          title="Estoque Atual de Vegetal" 
          :value="estoqueVegetal" 
          :date="dataUltimaAtualizacao" 
          color="green" 
          icon="leaf" 
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow-md max-w-full">
          <h2 class="text-xl font-bold text-gray-700 mb-4">Consumo de Vegetal por Sessão</h2>
          
          <div class="chart-container">
            <BarChart 
              v-if="consumoData.length" 
              :data="consumoData" 
            />
            <p v-else class="text-gray-500 text-center">Nenhum dado de consumo disponível.</p>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardTableCard 
          title="5 Últimos Mestres Dirigentes" 
          :items="ultimosMestresFormatado" 
          color="blue" 
          icon="crown" 
        />
        <DashboardTableCard 
          title="5 Últimos a Ler Documentos" 
          :items="ultimosLeitoresFormatado" 
          color="purple" 
          icon="file-alt" 
        />
        <DashboardTableCard 
          title="5 Últimos a Explanar" 
          :items="ultimosExplanadoresFormatado" 
          color="orange" 
          icon="comment-dots" 
        />
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import PrivateLayout from '../components/PrivateLayout.vue'
import DashboardStockCard from '../components/DashboardStockCard.vue' // Importação do novo componente
import DashboardTableCard from '../components/DashboardTableCard.vue'
import BarChart from '../components/BarChart.vue'

const API = import.meta.env.VITE_API_URL

const estoqueVegetal = ref(0)
const dataUltimaAtualizacao = ref(null) // Nova variável
const ultimosMestres = ref([])
const ultimosExplanadores = ref([])
const ultimosLeitores = ref([])
const consumoData = ref([])

const setupAuth = () => {
  const token = localStorage.getItem('token')
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    console.error('Nenhum token encontrado, redirecionando para o login.')
  }
}

const carregarDashboard = async () => {
  setupAuth();

  try {
    const { data: stats } = await axios.get(`${API}/api/sessoes/dashboard/stats`);
    estoqueVegetal.value = stats.estoqueAtual;
    dataUltimaAtualizacao.value = stats.dataUltimaAtualizacao; // Armazenamos a data

    const { data: mestres } = await axios.get(`${API}/api/sessoes/dashboard/ultimos-dirigentes`);
    ultimosMestres.value = mestres;

    const { data: explanadores } = await axios.get(`${API}/api/sessoes/dashboard/ultimos-explanadores`);
    ultimosExplanadores.value = explanadores;

    const { data: leitores } = await axios.get(`${API}/api/sessoes/dashboard/ultimos-leitores`);
    ultimosLeitores.value = leitores;

    const { data: consumo } = await axios.get(`${API}/api/sessoes/dashboard/consumo-medio`);
    consumoData.value = consumo;

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err)
  }
};

onMounted(() => {
  carregarDashboard()
});

const ultimosMestresFormatado = computed(() => {
  return ultimosMestres.value.map(s => ({
    nome: s.mestreDirigente,
    data: s.dataSessao
  }));
});

const ultimosExplanadoresFormatado = computed(() => {
  return ultimosExplanadores.value.map(s => ({
    nome: s.quemExplanou,
    data: s.dataSessao
  }));
});

const ultimosLeitoresFormatado = computed(() => {
  return ultimosLeitores.value.map(s => ({
    nome: s.quemLeuDocumentos,
    data: s.dataSessao
  }));
});
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