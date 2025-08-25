<template>
  <PrivateLayout>
    <div class="sessao-page">
      <h1>Registrar Sessão 🌿</h1>

      <!-- Mensagens -->
      <p v-if="sucesso" class="success-message">{{ sucesso }}</p>
      <p v-if="erro" class="error-message">{{ erro }}</p>

      <!-- Estoque Inicial -->
      <div class="card estoque-card">
        <h2>Estoque Inicial</h2>
        <input
          type="number"
          v-model.number="estoqueInicial"
          placeholder="Informe o Estoque Inicial"
          min="0"
          readonly
        />
      </div>

      <!-- Formulário -->
      <form @submit.prevent="criarSessao" class="sessao-form">
        <input v-model="novaSessao.visitante" type="text" placeholder="Nome do Visitante" required />
        <input v-model="novaSessao.mestreDirigente" type="text" placeholder="Mestre Dirigente" required />
        <select v-model="novaSessao.tipoSessao" required>
          <option value="" disabled>Tipo de Sessão</option>
          <option>Escala</option>
          <option>Escala Anual</option>
          <option>Instrutiva</option>
          <option>Quadro de Mestres</option>
          <option>Direção</option>
          <option>Extra</option>
          <option>Adventícios</option>
          <option>Outros</option>
        </select>
        <input v-model="novaSessao.quemExplanou" type="text" placeholder="Quem fez a Explanação" required />
        <input v-model="novaSessao.quemLeuDocumentos" type="text" placeholder="Quem leu os documentos" required />
        <input v-model.number="novaSessao.participantes" type="number" placeholder="Número de Participantes" min="0" required />
        <input v-model="novaSessao.chamadasFeitas" type="text" placeholder="Chamadas feitas" />
        <input v-model="novaSessao.vegetal" type="text" placeholder="Vegetal utilizado" required />
        <input v-model.number="novaSessao.quantidadeCoada" type="number" placeholder="Quantidade Coada" min="0" required />
        <input v-model.number="novaSessao.retornoSessao" type="number" placeholder="Retorno da Sessão" min="0" required />

        <button type="submit">Registrar Sessão</button>
      </form>

      <!-- Estoque Final -->
      <div class="card estoque-card">
        <h2>Estoque Final</h2>
        <p>{{ estoqueFinal }}</p>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PrivateLayout from '../components/PrivateLayout.vue'

const novaSessao = ref({
  visitante: '',
  mestreDirigente: '',
  tipoSessao: '',
  quemExplanou: '',
  quemLeuDocumentos: '',
  participantes: 0,
  chamadasFeitas: '',
  vegetal: '',
  quantidadeCoada: 0,
  retornoSessao: 0
})

const estoqueInicial = ref(0)
const estoqueFinal = ref(0)
const sucesso = ref('')
const erro = ref('')

const API_SESSOES = import.meta.env.VITE_API_URL + '/api/sessoes'
const API_ESTOQUE = import.meta.env.VITE_API_URL + '/api/estoques'

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

// Pegar o último estoque ao montar a página
onMounted(async () => {
  try {
    const res = await axios.get(`${API_ESTOQUE}/derradeiro`)
    estoqueInicial.value = res.data.quantidade || 0
  } catch (e) {
    erro.value = 'Não foi possível carregar o estoque inicial: ' + (e.response?.data?.error || e.message)
  }
})

const criarSessao = async () => {
  sucesso.value = ''
  erro.value = ''

  novaSessao.value.estoqueInicial = estoqueInicial.value

  try {
    const res = await axios.post(API_SESSOES, novaSessao.value)
    
    sucesso.value = 'Sessão registrada com sucesso!'

    estoqueInicial.value = res.data.estoqueFinal
    estoqueFinal.value = res.data.estoqueFinal

    // Resetar formulário
    novaSessao.value = {
      visitante: '',
      mestreDirigente: '',
      tipoSessao: '',
      quemExplanou: '',
      quemLeuDocumentos: '',
      participantes: 0,
      chamadasFeitas: '',
      vegetal: '',
      quantidadeCoada: 0,
      retornoSessao: 0
    }

    setTimeout(() => (sucesso.value = ''), 3000)
  } catch (e) {
    erro.value = 'Erro ao registrar sessão: ' + (e.response?.data?.error || e.message)
  }
}
</script>


<style scoped>
/* mantém seu estilo atual */
</style>


  
  <style scoped>
  .sessao-page {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
    box-sizing: border-box;
  }
  
  .sessao-page h1 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: #09861a;
  }
  
  .sessao-form {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .sessao-form input,
  .sessao-form select {
    flex: 1 1 150px;
    padding: 0.6rem;
    font-size: 1rem;
    min-width: 120px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .sessao-form button {
    flex-basis: 100%;
    padding: 0.75rem;
    background-color: #09861a;
    color: white;
    border: none;
    cursor: pointer;
    font-weight: bold;
    border-radius: 6px;
    font-size: 1.1rem;
    transition: background-color 0.3s;
  }
  
  .sessao-form button:hover {
    background-color: #076215;
  }
  
  .card {
    background-color: #f4fdf7;
    border-left: 5px solid #09861a;
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
  }
  
  .estoque-card input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    margin-top: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
  
  .estoque-card p {
    font-size: 1.2rem;
    font-weight: bold;
    margin-top: 0.5rem;
  }
  
  .success-message {
    color: green;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  .error-message {
    color: red;
    margin-bottom: 1rem;
    font-weight: bold;
  }
  
  @media (max-width: 720px) {
    .sessao-form {
      flex-direction: column;
    }
  
    .sessao-form input,
    .sessao-form select,
    .sessao-form button,
    .estoque-card input {
      flex-basis: 100%;
      min-width: auto;
    }
  }
  </style>
  