<template>
  <div class="results_container">
    <BackgroundWave />
    
    <!-- Header -->
    <div class="quiz_header">
      <div class="breadcrumb">
        <span class="brand">BrainPOP</span>
        <span class="separator">/</span>
        <span class="quiz_title">{{ results?.quiz?.title || 'Quiz' }}</span>
        <span class="separator">/</span>
        <span class="current">Quiz</span>
      </div>
    </div>

    <!-- Results Content -->
    <div v-if="results" class="results_content">
      <!-- Score Header -->
      <div class="score_section">
        <h2 class="score_text">Scored {{ results.score }}/{{ results.total_questions }}</h2>
        
        <!-- Action Buttons -->
        <div class="action_buttons">
          <BaseButton 
            :theme="BUTTON_THEMES.TERTIARY" 
            @click="$emit('restart')"
            class="action_button"
          >
            Retry This Quiz
          </BaseButton>
          <BaseButton 
            :theme="BUTTON_THEMES.SECONDARY" 
            @click="$emit('newQuiz')"
            class="action_button"
          >
            Try Another Quiz
          </BaseButton>
        </div>
      </div>

      <!-- Questions Results -->
      <div class="results_list">
        <div 
          v-for="(question, index) in results.questions" 
          :key="question.question_id"
          class="result_item"
        >
          <!-- Question -->
          <div class="result_question">
            <h3 class="question_number">{{ question.question_order }}</h3>
            <p class="question_text">{{ question.question_text }}</p>
          </div>

          <!-- Options -->
          <div class="result_options">
            <div 
              v-for="option in question.options" 
              :key="option.id"
              class="result_option"
              :class="{
                'correct': option.is_correct,
                'selected': question.user_answer.selected_option_id === option.id,
                'wrong': question.user_answer.selected_option_id === option.id && !option.is_correct
              }"
            >
              <span class="option_letter">{{ option.option_letter }}</span>
              <span class="option_text">{{ option.option_text }}</span>
              <span v-if="option.is_correct" class="check_icon">✓</span>
              <span v-else-if="question.user_answer.selected_option_id === option.id && !option.is_correct" class="cross_icon">✗</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else class="loading">
      <p>Loading results...</p>
    </div>
  </div>
</template>

<script>
// CONFIGURATIONS
import { THEMES as BUTTON_THEMES } from '@/components/base/button/config.js'

// COMPONENTS
import BackgroundWave from '@/components/base/backgrounds/wave/BackgroundWave.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'QuizResultsScreen',
  components: { BackgroundWave, BaseButton },
  emits: ['restart', 'newQuiz'],
  props: {
    results: Object
  },
  data() {
    return {
      BUTTON_THEMES
    }
  }
}
</script>

<style lang="scss" scoped>
.results_container {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
}

.quiz_header {
  background: #5a9b8e;
  padding: 15px 20px;
  color: white;
  position: relative;
  z-index: 10;

  .breadcrumb {
    font-size: 16px;
    
    .brand {
      font-weight: bold;
    }
    
    .separator {
      margin: 0 10px;
    }
  }
}

.results_content {
  position: relative;
  z-index: 10;
  padding: 40px 20px;
  
  .score_section {
    background: rgba(240, 248, 255, 0.9);
    text-align: center;
    padding: 30px;
    margin: 0 auto 40px;
    max-width: 800px;
    border-radius: 8px;
    
    .score_text {
      font-size: 36px;
      color: #333;
      margin: 0 0 30px 0;
      font-weight: bold;
    }
    
    .action_buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
      
      .action_button {
        min-width: 160px;
      }
    }
  }
  
  .results_list {
    max-width: 800px;
    margin: 0 auto;
    
    .result_item {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 25px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .result_question {
      margin-bottom: 20px;
      
      .question_number {
        font-size: 48px;
        margin: 0 0 10px 0;
        color: #333;
        font-weight: bold;
      }
      
      .question_text {
        font-size: 18px;
        margin: 0;
        color: #666;
        line-height: 1.4;
      }
    }
    
    .result_options {
      .result_option {
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        padding: 15px 20px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        position: relative;
        transition: all 0.2s;
        
        &.correct {
          border-color: #4caf50;
          background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
        }
        
        &.wrong {
          border-color: #f44336;
          background: linear-gradient(135deg, #ffeaea 0%, #ffebee 100%);
        }
        
        .option_letter {
          background: #f8f9fa;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 15px;
          font-size: 16px;
          font-weight: bold;
          border: 2px solid #e9ecef;
        }
        
        &.correct .option_letter {
          background: #4caf50;
          color: white;
          border-color: #4caf50;
        }
        
        &.wrong .option_letter {
          background: #f44336;
          color: white;
          border-color: #f44336;
        }
        
        .option_text {
          font-size: 16px;
          flex: 1;
          color: #333;
        }
        
        .check_icon {
          color: #4caf50;
          font-weight: bold;
          font-size: 20px;
          margin-left: 15px;
        }
        
        .cross_icon {
          color: #f44336;
          font-weight: bold;
          font-size: 20px;
          margin-left: 15px;
        }
      }
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  position: relative;
  z-index: 10;
  
  p {
    font-size: 18px;
    color: #666;
  }
}
</style>