import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import RegistrarSessao from '../pages/RegistrarSessao.vue'
import RegistrarUsuario from '../pages/RegistrarUsuario.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/registrar-sessao', component: RegistrarSessao },
  { path: '/registrar-usuario', component: RegistrarUsuario }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
