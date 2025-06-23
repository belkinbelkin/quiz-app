import API_CONFIG from '@/config/api.js'
import { useUserStore } from '@/stores/user'
import router from '@/router'

class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.BASE_URL
    this.endpoints = API_CONFIG.ENDPOINTS
  }

  async makeRequest(endpoint, method = 'GET', data = null, requiresAuth = true) {
    const token = localStorage.getItem('auth_token')
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    }

    // Add auth header if required and token exists
    if (requiresAuth && token) {
      options.headers['Authorization'] = `Bearer ${token}`
    }

    // Add body for non-GET requests
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data)
    }

    const url = `${this.baseURL}${endpoint}`
    
    try {
      const response = await fetch(url, options)
      
      if (!response.ok) {
        if (response.status === 401 && requiresAuth) {
          // Token expired or invalid - logout user
          const userStore = useUserStore()
          userStore.logout()
          router.push('/login')
          throw new Error('Authentication expired')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error)
      throw error
    }
  }

  // Authentication
  async login(credentials) {
    return this.makeRequest(this.endpoints.LOGIN, 'POST', credentials, false)
  }

  // Quiz operations
  async getQuizzes() {
    return this.makeRequest(this.endpoints.QUIZZES)
  }

  async getQuiz(quizId) {
    return this.makeRequest(this.endpoints.QUIZ(quizId))
  }

  async startQuiz(quizId) {
    return this.makeRequest(this.endpoints.START_QUIZ(quizId), 'POST')
  }

  async submitAnswer(attemptId, questionId, selectedOptionId) {
    return this.makeRequest(
      this.endpoints.SUBMIT_ANSWER(attemptId), 
      'POST', 
      {
        question_id: questionId,
        selected_option_id: selectedOptionId
      }
    )
  }

  async completeQuiz(attemptId) {
    return this.makeRequest(this.endpoints.COMPLETE_QUIZ(attemptId), 'POST')
  }

  async getResults(attemptId) {
    return this.makeRequest(this.endpoints.GET_RESULTS(attemptId))
  }

  async getAttemptStatus(attemptId) {
    return this.makeRequest(this.endpoints.GET_ATTEMPT_STATUS(attemptId))
  }
}

// Export singleton instance
export default new ApiService()