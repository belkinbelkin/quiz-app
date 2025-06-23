// client/src/config/api.js
const API_CONFIG = {
    // Default to localhost for development
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    ENDPOINTS: {
      LOGIN: '/api/login',
      QUIZZES: '/api/quizzes',
      QUIZ: (id) => `/api/quiz/${id}`,
      START_QUIZ: (id) => `/api/quiz/${id}/start`,
      SUBMIT_ANSWER: (attemptId) => `/api/quiz-attempt/${attemptId}/answer`,
      COMPLETE_QUIZ: (attemptId) => `/api/quiz-attempt/${attemptId}/complete`,
      GET_RESULTS: (attemptId) => `/api/quiz-attempt/${attemptId}/results`,
      GET_ATTEMPT_STATUS: (attemptId) => `/api/quiz-attempt/${attemptId}/status`
    }
  }
  
  export default API_CONFIG