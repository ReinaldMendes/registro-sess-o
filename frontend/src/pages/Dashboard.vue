<template>
    <PrivateLayout>
      <div class="p-4 md:p-8 bg-gray-100 min-h-screen">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Dashboard 🕊️</h1>
  
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <DashboardCard title="Sessões Recentes" color="blue" icon="calendar">
            <p class="text-center text-gray-600">em breve...</p>
          </DashboardCard>
  
          <DashboardCard title="Visitantes Presentes" color="green" icon="users">
            <p class="text-center text-gray-600">em breve...</p>
          </DashboardCard>
  
          <DashboardCard title="Estoque de Vegetal" color="red" icon="leaf">
            <p class="text-center text-gray-600">em breve...</p>
          </DashboardCard>
  
          <DashboardCard title="Chamadas Realizadas" color="yellow" icon="check">
            <p class="text-center text-gray-600">em breve...</p>
          </DashboardCard>
  
          <DashboardCard title="Sessões Futuras" color="purple" icon="calendar-clock">
            <p class="text-center text-gray-600">em breve...</p>
          </DashboardCard>
        </div>
      </div>
    </PrivateLayout>
  </template>
  
  <script setup>
  import PrivateLayout from '../components/PrivateLayout.vue'
  import DashboardCard from '../components/DashboardCard.vue'
  </script>
  