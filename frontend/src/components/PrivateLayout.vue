<template>
    <div class="layout">
      <header>
        <div class="logo-container" @click="goDashboard" role="button" tabindex="0" @keydown.enter="goDashboard" aria-label="Ir para dashboard">
          <img :src="logo" alt="Logo" class="logo" />
          <h1>Registro de Sessões UDV</h1>
        </div>
  
        <button class="mobile-menu-btn" @click="menuAberto = !menuAberto" aria-label="Abrir menu">
          ☰
        </button>
  
        <button class="logout-btn" @click="logout">Sair</button>
      </header>
  
      <nav :class="{ aberto: menuAberto }" @click="menuAberto = false">
        <router-link to="/registrar-sessao">Registrar Sessão</router-link>
        <router-link to="/registrar-usuario">Registrar Usuário</router-link>
        <router-link to="/registrar-estoque">Registrar Estoque</router-link>
        <router-link to="/consultar-sessao">Consultar Sessão</router-link>
      </nav>
  
      <main>
        <slot />
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import logo from '../assets/udv_logo.jpg'
  
  const router = useRouter()
  const menuAberto = ref(false)
  
  function logout() {
    localStorage.removeItem('token')
    router.push('/login')
  }
  
  function goDashboard() {
    menuAberto.value = false
    router.push('/dashboard') // define qual página abrir ao clicar no logo
  }
  </script>
  
  <style scoped>
  .layout {
    display: grid;
    grid-template-areas:
      "header"
      "nav"
      "main";
    grid-template-rows: 60px auto 1fr;
    height: 100vh;
  }
  
  header {
    grid-area: header;
    background-color: #09861a;
    color: white;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo-container {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
  }
  
  .logo {
    height: 40px;
    width: auto;
    object-fit: contain;
  }
  
  .logo-container h1 {
    font-size: 1.4rem;
    font-weight: bold;
  }
  
  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    font-size: 2rem;
    color: white;
    cursor: pointer;
  }
  
  .logout-btn {
    background: white;
    color: #e74c3c;
    border: none;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }
  
  nav {
    grid-area: nav;
    background-color: #f1f1f1;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  nav a {
    text-decoration: none;
    color: #333;
    font-weight: bold;
  }
  
  nav a.router-link-exact-active {
    color: #09861a;
  }
  
  main {
    grid-area: main;
    padding: 2rem;
    overflow-y: auto;
  }
  
  /* Responsivo */
  @media (min-width: 768px) {
    .layout {
      grid-template-columns: 200px 1fr;
      grid-template-rows: 60px 1fr;
      grid-template-areas:
        "header header"
        "nav main";
    }
    .mobile-menu-btn {
      display: none;
    }
    nav {
      display: flex !important;
    }
  }
  
  @media (max-width: 767px) {
    .mobile-menu-btn {
      display: block;
    }
    nav {
      display: none;
      grid-area: nav;
    }
    nav.aberto {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background-color: #f1f1f1;
      padding: 1rem;
      position: absolute;
      top: 60px;
      left: 0;
      right: 0;
      z-index: 10;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  }
  </style>
  