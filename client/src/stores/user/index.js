// client/src/stores/user/index.js
import { defineStore } from 'pinia'
import apiService from '@/services/apiService'

export const useUserStore = defineStore('user', {
  state: () => ({
    loggedIn: false,
    user: null
  }),
  getters: {
    isLoggedIn: state => {
      let loggedIn = window.localStorage.getItem('loggedIn')
      let token = window.localStorage.getItem('auth_token')
      return (loggedIn && token) || state.loggedIn
    },
    currentUser: state => {
      let user = window.localStorage.getItem('user')
      return user ? JSON.parse(user) : state.user
    }
  },
  actions: {
    async login(credentials, callback) {
      try {
        const response = await apiService.login(credentials)
        
        this.loggedIn = true
        this.user = credentials // Store basic user info
        
        // Store in localStorage
        window.localStorage.setItem('loggedIn', 'true')
        window.localStorage.setItem('auth_token', response.access_token)
        window.localStorage.setItem('user', JSON.stringify({
          email: credentials.email
        }))
        
        callback(true)
      } catch (error) {
        console.error('Login failed:', error)
        callback(false, error.message || 'Login failed')
      }
    },

    // Simple login for fallback (keeping original functionality)
    loginSimple(callback) {
      this.loggedIn = true
      window.localStorage.setItem('loggedIn', 'true')
      callback(true)
    },

    logout() {
      this.loggedIn = false
      this.user = null
      
      // Clear all localStorage data
      window.localStorage.removeItem('loggedIn')
      window.localStorage.removeItem('auth_token')
      window.localStorage.removeItem('user')
      
      // Clear quiz state as well
      window.localStorage.removeItem('brainpop_quiz_state')
      window.localStorage.removeItem('selectedQuiz')
      window.localStorage.removeItem('attemptId')
    }
  }
})