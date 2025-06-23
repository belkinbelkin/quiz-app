<template>
  <div class="quiz_container">
    <div v-if="!loading">
      <QuizSelectionScreen 
        v-if="quizState === QUIZ_STATES.SELECTION" 
        @selectQuiz="onQuizSelected"
      />
      <QuizStartScreen 
        v-if="quizState === QUIZ_STATES.START" 
        :name="selectedQuiz.title" 
        :topic="selectedQuiz.topic"
        :quiz="selectedQuiz"
        @start="start"
        @back="goBackToSelection"
      />
      <QuizQuestionsScreen 
        v-if="quizState === QUIZ_STATES.QUESTIONS"
        :quiz="selectedQuiz"
        :attemptId="attemptId"
        :currentQuestionIndex="currentQuestionIndex"
        @complete="onQuizComplete"
        @next="goToNextQuestion"
        @previous="goToPreviousQuestion"
      />
      <QuizResultsScreen
        v-if="quizState === QUIZ_STATES.RESULT"
        :results="results"
        @restart="restartQuiz"
        @newQuiz="goBackToSelection"
      />
    </div>
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="handleRetry">Retry</button>
    </div>
  </div>
</template>

<script>
import QuizSelectionScreen from './selectionScreen/QuizSelectionScreen.vue'
import QuizStartScreen from './startScreen/QuizStartScreen.vue'
import QuizQuestionsScreen from './questionsScreen/QuizQuestionsScreen.vue'
import QuizResultsScreen from './resultsScreen/QuizResultsScreen.vue'
import { useUserStore } from '@/stores/user'

const QUIZ_STATES = {
  SELECTION: 'selection',
  START: 'start',
  QUESTIONS: 'questions',
  RESULT: 'result'
}

export default {
  name: 'Quiz',
  components: {
    QuizSelectionScreen,
    QuizStartScreen,
    QuizQuestionsScreen,
    QuizResultsScreen
  },
  props: {
    data: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      QUIZ_STATES,
      quizState: QUIZ_STATES.SELECTION,
      selectedQuiz: null,
      attemptId: null,
      results: null,
      loading: false,
      error: null,
      currentQuestionIndex: 0
    }
  },
  mounted() {
    this.checkExistingQuizState()
  },
  methods: {
    checkExistingQuizState() {
      const savedState = this.getQuizState()
      console.log('Checking saved state:', savedState) // DEBUG
      
      if (savedState && savedState.attemptId && savedState.quizId) {
        this.attemptId = savedState.attemptId
        this.currentQuestionIndex = savedState.currentQuestionIndex || 0
        console.log('Restored question index:', this.currentQuestionIndex) // DEBUG
        this.resumeQuiz(savedState.quizId)
      }
    },

    async resumeQuiz(quizId) {
      this.loading = true
      
      try {
        const attemptStatus = await this.apiCall(`/api/quiz-attempt/${this.attemptId}/status`)
        
        if (attemptStatus.is_completed) {
          await this.loadQuizAndGoToResults(quizId)
        } else {
          await this.loadQuizAndResume(quizId)
        }
      } catch (err) {
        console.log('Could not resume quiz, starting fresh:', err)
        this.clearQuizState()
        this.quizState = QUIZ_STATES.SELECTION
      } finally {
        this.loading = false
      }
    },

    async loadQuizAndResume(quizId) {
      const quiz = await this.apiCall(`/api/quiz/${quizId}`)
      this.selectedQuiz = quiz
      this.quizState = QUIZ_STATES.QUESTIONS
      console.log('Resuming quiz at question index:', this.currentQuestionIndex) // DEBUG
      this.saveQuizState()
    },

    async loadQuizAndGoToResults(quizId) {
      const quiz = await this.apiCall(`/api/quiz/${quizId}`)
      this.selectedQuiz = { id: quiz.id, title: quiz.title, topic: quiz.topic }
      
      await this.loadResults()
      this.quizState = QUIZ_STATES.RESULT
    },

    onQuizSelected(quiz) {
      this.selectedQuiz = quiz
      this.quizState = QUIZ_STATES.START
    },

    goBackToSelection() {
      this.clearQuizState()
      this.selectedQuiz = null
      this.attemptId = null
      this.results = null
      this.currentQuestionIndex = 0
      this.quizState = QUIZ_STATES.SELECTION
    },

    async start() {
      this.loading = true
      this.error = null

      try {
        if (!this.selectedQuiz.questions) {
          const quizResponse = await this.apiCall(`/api/quiz/${this.selectedQuiz.id}`)
          this.selectedQuiz = quizResponse
        }

        const response = await this.apiCall(`/api/quiz/${this.selectedQuiz.id}/start`, 'POST')
        this.attemptId = response.attempt_id
        this.currentQuestionIndex = 0
        this.quizState = QUIZ_STATES.QUESTIONS

        this.saveQuizState()
      } catch (err) {
        if (err.message.includes('HTTP 400')) {
          await this.handleExistingAttempt()
        } else {
          this.error = 'Failed to start quiz. Please try again.'
          console.error('Error starting quiz:', err)
        }
      } finally {
        this.loading = false
      }
    },

    async handleExistingAttempt() {
      try {
        const response = await fetch(`http://localhost:3000/api/quiz/${this.selectedQuiz.id}/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          }
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          if (errorData.attempt_id) {
            this.attemptId = errorData.attempt_id
            
            const savedState = this.getQuizState()
            if (savedState && savedState.attemptId === this.attemptId) {
              this.currentQuestionIndex = savedState.currentQuestionIndex || 0
            } else {
              this.currentQuestionIndex = 0
            }
            
            this.quizState = QUIZ_STATES.QUESTIONS
            this.saveQuizState()
          } else {
            throw new Error('Could not handle existing attempt')
          }
        }
      } catch (err) {
        this.error = 'Found incomplete quiz. Please try again or contact support.'
        console.error('Error handling existing attempt:', err)
      }
    },

    goToNextQuestion() {
      if (this.currentQuestionIndex < this.selectedQuiz.questions.length - 1) {
        this.currentQuestionIndex++
        this.saveQuizState()
      }
    },

    goToPreviousQuestion() {
      if (this.currentQuestionIndex > 0) {
        this.currentQuestionIndex--
        this.saveQuizState()
      }
    },

    async onQuizComplete(attemptId) {
      this.loading = true
      this.error = null

      try {
        await this.loadResults()
        this.quizState = QUIZ_STATES.RESULT
        this.currentQuestionIndex = 0
        this.saveQuizState()
      } catch (err) {
        this.error = 'Failed to get results. Please try again.'
        console.error('Error getting results:', err)
      } finally {
        this.loading = false
      }
    },

    async loadResults() {
      const results = await this.apiCall(`/api/quiz-attempt/${this.attemptId}/results`)
      this.results = results
    },

    restartQuiz() {
      this.clearQuizState()
      this.attemptId = null
      this.results = null
      this.currentQuestionIndex = 0
      this.quizState = QUIZ_STATES.START
    },

    saveQuizState() {
      const stateToSave = {
        quizState: this.quizState,
        quizId: this.selectedQuiz?.id,
        attemptId: this.attemptId,
        currentQuestionIndex: this.currentQuestionIndex || 0
      }
      
      localStorage.setItem('brainpop_quiz_state', JSON.stringify(stateToSave))
    },

    getQuizState() {
      try {
        const saved = localStorage.getItem('brainpop_quiz_state')
        return saved ? JSON.parse(saved) : null
      } catch (err) {
        console.error('Error parsing saved quiz state:', err)
        localStorage.removeItem('brainpop_quiz_state')
        return null
      }
    },

    clearQuizState() {
      localStorage.removeItem('brainpop_quiz_state')
    },

    handleRetry() {
      if (this.quizState === QUIZ_STATES.START) {
        this.start()
      } else if (this.quizState === QUIZ_STATES.RESULT) {
        this.loadResults()
      } else {
        this.goBackToSelection()
      }
    },

    async apiCall(endpoint, method = 'GET', data = null) {
      const token = localStorage.getItem('auth_token')
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }

      if (data) {
        options.body = JSON.stringify(data)
      }

      const response = await fetch(`http://localhost:3000${endpoint}`, options)
      
      if (!response.ok) {
        if (response.status === 401) {
          const userStore = useUserStore()
          userStore.logout()
          this.$router.push('/login')
          throw new Error('Authentication expired')
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    }
  }
}
</script>

<style lang="scss" scoped>
.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  
  p {
    font-size: 18px;
    margin-bottom: 20px;
  }
  
  button {
    background: #5a9b8e;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: #4a8b7e;
    }
  }
}

.quiz_container {
  width: 100%;
}
</style>