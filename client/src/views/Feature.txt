<template>
  <div class="feature_container">
    <component v-if="supportedFeatures[featureType]" :data="data" :is="featureType" />
    <span v-else>{{ featureType }} feature is NOT supported YET</span>
  </div>
</template>

<script>
// FEATURE TYPES
import Quiz from '@/components/screens/features/quiz/Quiz.vue'

export default {
  name: 'Feature',
  components: {
    Quiz
  },
  data() {
    return {
      supportedFeatures: {
        quiz: true
      },
      featureType: 'quiz',
      data: null
    }
  },
  mounted() {
    this.featureType = this.$route.params.type?.toLowerCase() || this.featureType.toLowerCase()

    // fetch data
    this.data = {
      name: 'Test Quiz',
      questions: ([].length = 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.feature_container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
