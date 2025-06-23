import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Feature from '../views/Feature.vue'

import { useUserStore } from '@/stores/user'

const isLoggedIn = () => {
  const store = useUserStore()
  return store.isLoggedIn
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: () => {
        if (isLoggedIn()) {
          return '/feature/quiz'
        } else {
          return '/login'
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { 
        hideHeader: true // Don't show header on login page
      }
    },
    {
      path: '/feature/:type?',
      name: 'feature',
      component: Feature,
      meta: { requiresAuth: true }
    },
    {
      // Catch all route - redirect to home
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(to => {
  // BLOCK LOGIN FOR LOGGED IN USERS
  if (to.name === 'login' && isLoggedIn()) {
    return '/feature/quiz'
  }

  // REDIRECT TO LOGIN IF NOT LOGGED IN AND PAGE AUTH REQUIRED
  if (to.meta?.requiresAuth && !isLoggedIn()) {
    return '/login'
  }
})

export default router