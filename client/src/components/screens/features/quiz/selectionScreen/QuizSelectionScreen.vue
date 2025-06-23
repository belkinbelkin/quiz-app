<template>
  <div class="selection_container">
    <BackgroundWave />
    <Navigator
      :items="[
        { text: 'Quiz Selection', to: '' }
      ]"
    />
    <main class="selection_content">
      <h1>Available Quizzes</h1>
      <h2>Choose a quiz to get started</h2>
      
      <div v-if="loading" class="loading">
        <p>Loading quizzes...</p>
      </div>
      
      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
        <BaseButton :theme="BUTTON_THEMES.SECONDARY" @click="loadQuizzes">
          Retry
        </BaseButton>
      </div>
      
      <div v-else class="quizzes_grid">
        <div 
          v-for="quiz in quizzes" 
          :key="quiz.id"
          class="quiz_card"
          @click="selectQuiz(quiz)"
        >
          <div class="quiz_content">
            <h3 class="quiz_title">{{ quiz.title }}</h3>
            <p class="quiz_topic">{{ quiz.topic }}</p>
            <p class="quiz_description" v-if="quiz.description">{{ quiz.description }}</p>
            <div class="quiz_meta">
              <span class="question_count">{{ quiz.questions_count }} questions</span>
            </div>
          </div>
          <div class="quiz_action">
            <BaseButton :theme="BUTTON_THEMES.SECONDARY">
              Start Quiz
            </BaseButton>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// CONFIGURATIONS
import { THEMES as BUTTON_THEMES } from '@/components/base/button/config.js'

// COMPONENTS
import BackgroundWave from '@/components/base/backgrounds/wave/BackgroundWave.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'
import Navigator from '@/components/compositions/navigator/Navigator.vue'

import { useUserStore } from '@/stores/user'

export default {
  name: 'QuizSelectionScreen',
  emits: ['selectQuiz'],
  components: { 
    BackgroundWave, 
    BaseButton, 
    Navigator 
  },
  data() {
    return {
      BUTTON_THEMES,
      quizzes: [],
      loading: false,
      error: null
    }
  },
  async mounted() {
    await this.loadQuizzes()
  },
  methods: {
    async loadQuizzes() {
      this.loading = true
      this.error = null
      
      try {
        const response = await this.apiCall('/api/quizzes')
        this.quizzes = response
      } catch (err) {
        this.error = 'Failed to load quizzes. Please try again.'
        console.error('Error loading quizzes:', err)
      } finally {
        this.loading = false
      }
    },

    selectQuiz(quiz) {
      this.$emit('selectQuiz', quiz)
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
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utilities/css/vars/vars.scss';

.selection_container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  color: #343a41;
  padding-top: 2rem;
}

.selection_content {
  margin-block: 50px auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  gap: 1.2rem;
  padding: 0 2rem;
  
  h1 {
    font-size: 2.5rem;
    margin: 0;
    text-align: center;
  }
  
  h2 {
    font-size: 1.2rem;
    margin: 0 0 2rem 0;
    text-align: center;
    color: #666;
    font-weight: normal;
  }
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  
  p {
    font-size: 18px;
    margin-bottom: 20px;
    color: #666;
  }
}

.quizzes_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  margin-top: 1rem;
}

.quiz_card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
  
  .quiz_content {
    flex: 1;
    
    .quiz_title {
      font-size: 1.5rem;
      margin: 0 0 0.5rem 0;
      color: #333;
      font-weight: bold;
    }
    
    .quiz_topic {
      font-size: 1rem;
      margin: 0 0 1rem 0;
      color: #5a9b8e;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .quiz_description {
      font-size: 0.95rem;
      margin: 0 0 1rem 0;
      color: #666;
      line-height: 1.4;
    }
    
    .quiz_meta {
      .question_count {
        background: #f0f8f6;
        color: #5a9b8e;
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.9rem;
        font-weight: 500;
      }
    }
  }
  
  .quiz_action {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
}
</style>