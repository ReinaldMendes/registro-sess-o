<template>
    <PrivateLayout>
      <div class="max-w-2xl mx-auto p-6 bg-gray-50 rounded-xl shadow-md">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Registrar Usuário</h1>
  
        <form @submit.prevent="submitForm" class="space-y-6">
          <!-- Nome -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Nome Completo</label>
            <input v-model="usuario.nome" type="text" placeholder="Nome completo" class="w-full border-gray-300 rounded-md p-2"/>
          </div>
  
          <!-- E-mail -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">E-mail</label>
            <input v-model="usuario.email" type="email" placeholder="seu@email.com" class="w-full border-gray-300 rounded-md p-2"/>
          </div>
  
          <!-- Senha -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Senha</label>
            <input v-model="usuario.senha" type="password" placeholder="Senha" class="w-full border-gray-300 rounded-md p-2"/>
          </div>
  
          <!-- Confirmação de senha -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Confirme a Senha</label>
            <input v-model="usuario.confirmarSenha" type="password" placeholder="Confirme a senha" class="w-full border-gray-300 rounded-md p-2"/>
          </div>
  
          <!-- Papel/Role -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1">Papel</label>
            <select v-model="usuario.role" class="w-full border-gray-300 rounded-md p-2">
              <option value="USER">Usuário</option>
              <option value="ADMINISTRATOR">Administrador</option>
            </select>
          </div>
  
          <!-- Botão Submit -->
          <button type="submit" class="w-full bg-blue-600 text-white font-bold p-3 rounded-md hover:bg-blue-700 transition">
            Registrar Usuário
          </button>
  
          <!-- Feedback -->
          <p v-if="mensagem" class="mt-4 text-center text-green-600 font-semibold">{{ mensagem }}</p>
          <p v-if="erro" class="mt-4 text-center text-red-600 font-semibold">{{ erro }}</p>
        </form>
      </div>
    </PrivateLayout>
  </template>
  
  <script setup>
  import { reactive, ref } from 'vue'
  import PrivateLayout from '../components/PrivateLayout.vue'
  
  const mensagem = ref('')
  const erro = ref('')
  
  const usuario = reactive({
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    role: 'USER'
  })
  
  async function submitForm() {
    erro.value = ''
    mensagem.value = ''
  
    if (usuario.senha !== usuario.confirmarSenha) {
      erro.value = 'As senhas não conferem'
      return
    }
  
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/usuario/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          role: usuario.role
        })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao registrar usuário')
  
      mensagem.value = 'Usuário registrado com sucesso!'
  
      // Resetar formulário
      usuario.nome = ''
      usuario.email = ''
      usuario.senha = ''
      usuario.confirmarSenha = ''
      usuario.role = 'USER'
  
    } catch (e) {
      erro.value = e.message
    }
  }
  </script>
  
  <style scoped>
  /* Ajustes extras se necessário */
  </style>
  