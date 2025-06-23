import { defineStore } from 'pinia'

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
    login(credentials, callback) {
      // Make API call to login
      this.apiLogin(credentials)
        .then(response => {
          this.loggedIn = true
          this.user = credentials // Store basic user info
          
          // Store in localStorage
          window.localStorage.setItem('loggedIn', 'true')
          window.localStorage.setItem('auth_token', response.access_token)
          window.localStorage.setItem('user', JSON.stringify({
            email: credentials.email
          }))
          
          // ACTIVATE CALLBACK WITH THE LOGIN STATUS
          callback(true)
        })
        .catch(error => {
          console.error('Login failed:', error)
          callback(false, error.message || 'Login failed')
        })
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
      window.localStorage.removeItem('quizState')
      window.localStorage.removeItem('selectedQuiz')
      window.localStorage.removeItem('attemptId')
    },

    async apiLogin(credentials) {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Login failed')
      }

      return await response.json()
    }
  }
})