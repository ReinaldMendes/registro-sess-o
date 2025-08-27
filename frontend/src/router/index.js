import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import RegistrarSessao from '../pages/RegistrarSessao.vue'
import RegistrarUsuario from '../pages/RegistrarUsuario.vue'
import EstoqueSessao from '../pages/EstoqueSessao.vue'
import ConsultaSessao from '../pages/ConsultaSessao.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
  { path: '/registrar-sessao', component: RegistrarSessao },
  { path: '/registrar-usuario', component: RegistrarUsuario },
  {path: '/registrar-estoque', component: EstoqueSessao},
  {path: '/consultar-sessao', component: ConsultaSessao}
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !token) {
    next('/login') // se não estiver logado, redireciona para login
  } else {
    next() // se estiver logado ou for página pública, continua
  }
})

export default router
