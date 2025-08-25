<template>
  <PrivateLayout>
    <div class="usuario-page">
      <h1>Registrar Usuário 👤</h1>

      <!-- Mensagens -->
      <p v-if="sucesso" class="success-message">{{ sucesso }}</p>
      <p v-if="erro" class="error-message">{{ erro }}</p>

      <!-- Formulário -->
      <form @submit.prevent="registrarUsuario" class="usuario-form">
        <input v-model="novoUsuario.nome" type="text" placeholder="Nome completo" required />
        <input v-model="novoUsuario.email" type="email" placeholder="Email" required />
        <input v-model="novoUsuario.senha" type="password" placeholder="Senha" required />

        <button type="submit">Cadastrar Usuário</button>
      </form>

      <!-- Lista de Usuários -->
      <div class="usuarios-lista">
        <h2>Usuários Registrados</h2>
        <ul v-if="usuarios.length">
          <li v-for="user in usuarios" :key="user._id">
            <span class="nome">{{ user.nome }}</span>
            <span class="email">{{ user.email }}</span>
          </li>
        </ul>
        <p v-else>Nenhum usuário cadastrado ainda.</p>
      </div>
    </div>
  </PrivateLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import PrivateLayout from '../components/PrivateLayout.vue'

const novoUsuario = ref({
  nome: '',
  email: '',
  senha: ''
})

const sucesso = ref('')
const erro = ref('')
const usuarios = ref([])

axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`

const API_REGISTER = import.meta.env.VITE_API_URL + '/api/auth/register'
const API_LIST = import.meta.env.VITE_API_URL + '/api/auth/usuarios'

// carregar lista ao montar
const carregarUsuarios = async () => {
  try {
    const { data } = await axios.get(API_LIST)
    usuarios.value = data
  } catch (e) {
    erro.value = 'Erro ao carregar usuários: ' + (e.response?.data?.message || e.message)
  }
}

onMounted(() => {
  carregarUsuarios()
})

const registrarUsuario = async () => {
  sucesso.value = ''
  erro.value = ''
  try {
    await axios.post(API_REGISTER, novoUsuario.value)
    sucesso.value = 'Usuário cadastrado com sucesso!'

    // Resetar formulário
    novoUsuario.value = { nome: '', email: '', senha: '' }

    // recarregar lista
    await carregarUsuarios()

    setTimeout(() => (sucesso.value = ''), 3000)
  } catch (e) {
    erro.value = 'Erro ao registrar usuário: ' + (e.response?.data?.message || e.message)
  }
}
</script>

<style scoped>
.usuario-page {
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
  box-sizing: border-box;
}

.usuario-page h1 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #09861a;
}

.usuario-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.usuario-form input {
  padding: 0.6rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.usuario-form button {
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

.usuario-form button:hover {
  background-color: #076215;
}

.usuarios-lista {
  background-color: #f4fdf7;
  border-left: 5px solid #09861a;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 2rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

.usuarios-lista h2 {
  margin-bottom: 1rem;
  color: #076215;
}

.usuarios-lista ul {
  list-style: none;
  padding: 0;
}

.usuarios-lista li {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

.usuarios-lista li:last-child {
  border-bottom: none;
}

.nome {
  font-weight: bold;
}

.email {
  color: #555;
  font-size: 0.9rem;
}
</style>
