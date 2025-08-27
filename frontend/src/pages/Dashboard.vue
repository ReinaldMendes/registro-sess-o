<template>
  <PrivateLayout>
    <div class="p-6 md:p-10 bg-gray-100 min-h-screen">
      <h1 class="text-4xl font-bold text-gray-800 mb-8">Dashboard 🕊️</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard title="Sessões Recentes" color="blue" icon="calendar">
          <p class="text-2xl font-semibold text-center text-blue-700">{{ sessoesRecentes }}</p>
        </DashboardCard>

        <DashboardCard title="Visitantes Presentes" color="green" icon="users">
          <p class="text-2xl font-semibold text-center text-green-700">{{ visitantesPresentes }}</p>
        </DashboardCard>

        <DashboardCard title="Estoque de Vegetal" color="red" icon="leaf">
          <p class="text-2xl font-semibold text-center text-red-700">{{ estoqueVegetal }}</p>
        </DashboardCard>

        <DashboardCard title="Chamadas Realizadas" color="yellow" icon="check">
          <p class="text-2xl font-semibold text-center text-yellow-700">{{ chamadasRealizadas }}</p>
        </DashboardCard>

        <DashboardCard title="Sessões Futuras" color="purple" icon="calendar-clock">
          <p class="text-2xl font-semibold text-center text-purple-700">{{ sessoesFuturas }}</p>
        </DashboardCard>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PrivateLayout from '../components/PrivateLayout.vue'
import DashboardCard from '../components/DashboardCard.vue'

const API = import.meta.env.VITE_API_URL

// Dados do dashboard
const sessoesRecentes = ref(0)
const visitantesPresentes = ref(0)
const estoqueVegetal = ref(0)
const chamadasRealizadas = ref(0)
const sessoesFuturas = ref(0)

// Autenticação
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

const carregarDashboard = async () => {
  try {
    const { data: sessoes } = await axios.get(`${API}/sessoes`)
    
    // Sessões recentes
    sessoesRecentes.value = sessoes.length

    // Visitantes presentes
    visitantesPresentes.value = sessoes.reduce((total, s) => total + (s.participantes || 0), 0)

    // Estoque vegetal
    estoqueVegetal.value = sessoes.length > 0 ? sessoes[sessoes.length - 1].estoqueFinal : 0

    // Chamadas realizadas
    chamadasRealizadas.value = sessoes.reduce((total, s) => {
      if (s.chamadasFeitas) {
        return total + s.chamadasFeitas.split(',').length
      }
      return total
    }, 0)

    // Sessões futuras
    const hoje = new Date()
    sessoesFuturas.value = sessoes.filter(s => new Date(s.createdAt) > hoje).length

  } catch (err) {
    console.error('Erro ao carregar dashboard:', err)
  }
}

onMounted(() => {
  carregarDashboard()
})
</script>

<style scoped>
h1 {
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

/* DashboardCard melhorias */
.dashboard-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}
</style>
