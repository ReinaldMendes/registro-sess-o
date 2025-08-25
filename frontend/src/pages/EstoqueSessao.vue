<template>
    <PrivateLayout>
      <div class="estoque-page">
        <h1>Registrar Estoque 🌿</h1>
  
        <p v-if="sucesso" class="success-message">{{ sucesso }}</p>
        <p v-if="erro" class="error-message">{{ erro }}</p>
  
        <form @submit.prevent="registrarEstoque" class="estoque-form">
          <input
            v-model.number="novoEstoque.quantidade"
            type="number"
            placeholder="Quantidade disponível"
            min="0"
            required
          />
          <input
            v-model="novoEstoque.observacao"
            type="text"
            placeholder="Observação"
          />
          <button type="submit">Registrar Estoque</button>
        </form>
  
        <div v-if="historico.length" class="historico">
          <h2>Histórico de Estoques</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Quantidade</th>
                <th>Observação</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in historico" :key="item._id">
                <td>{{ index + 1 }}</td>
                <td>{{ item.quantidade }}</td>
                <td>{{ item.observacao }}</td>
                <td>{{ new Date(item.createdAt).toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PrivateLayout>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue"
  import axios from "axios"
  import PrivateLayout from "../components/PrivateLayout.vue"
  
  const novoEstoque = ref({ quantidade: 0, observacao: "" })
  const sucesso = ref("")
  const erro = ref("")
  const historico = ref([])
  
  const API = import.meta.env.VITE_API_URL + "/api/estoques"
  axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`
  
  const registrarEstoque = async () => {
    sucesso.value = ""
    erro.value = ""
    try {
      const res = await axios.post(API, novoEstoque.value)
      sucesso.value = "Estoque registrado!"
      novoEstoque.value = { quantidade: 0, observacao: "" }
      buscarHistorico()
      setTimeout(() => (sucesso.value = ""), 3000)
    } catch (e) {
      erro.value = "Erro ao registrar estoque: " + (e.response?.data?.error || e.message)
    }
  }
  
  const buscarHistorico = async () => {
    try {
      const res = await axios.get(API)
      historico.value = res.data
    } catch (e) {
      console.error("Erro ao buscar histórico:", e)
    }
  }
  
  onMounted(() => buscarHistorico())
  </script>
  
  <style scoped>
  .estoque-page { padding: 2rem; max-width: 700px; margin: 0 auto; }
  .estoque-form { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
  .estoque-form input { flex: 1 1 150px; padding: 0.6rem; border-radius: 6px; border: 1px solid #ccc; }
  .estoque-form button { flex-basis: 100%; padding: 0.75rem; background-color: #09861a; color: #fff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
  .estoque-form button:hover { background-color: #076215; }
  .success-message { color: green; font-weight: bold; margin-bottom: 1rem; }
  .error-message { color: red; font-weight: bold; margin-bottom: 1rem; }
  .historico table { width: 100%; border-collapse: collapse; }
  .historico th, .historico td { border: 1px solid #ccc; padding: 0.5rem; text-align: center; }
  .historico th { background-color: #f4fdf7; }
  </style>
  