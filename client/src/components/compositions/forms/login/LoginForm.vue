<template>
  <form class="login_form" @submit.prevent="submit">
    <div v-if="error" class="error_message">
      {{ error }}
    </div>
    
    <BaseInput v-model="userName" label="Username" :disabled="loading" />
    <BaseInput v-model="password" label="Password" type="password" :disabled="loading" />
    <BaseButton type="submit" fullWidth :disabled="loading || !canSubmit">
      {{ loading ? 'Signing in...' : 'Log in' }}
    </BaseButton>
    
    <div class="demo_credentials">
      <p><strong>Demo credentials:</strong></p>
      <p>Username: admin</p>
      <p>Password: admin</p>
    </div>
  </form>
</template>

<script>
// COMPONENTS
import BaseInput from '@/components/base/input/BaseInput.vue'
import BaseButton from '@/components/base/button/BaseButton.vue'

export default {
  name: 'LoginForm',
  emits: ['submit'],
  components: {
    BaseInput,
    BaseButton
  },
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      userName: '',
      password: ''
    }
  },
  computed: {
    canSubmit() {
      return this.userName.trim() && this.password.trim()
    }
  },
  methods: {
    submit() {
      if (this.canSubmit && !this.loading) {
        this.$emit('submit', {
          email: this.userName, // Backend expects 'email' field
          password: this.password
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utilities/css/vars/vars.scss';

.login_form {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: $ESSENTIALS_BLUE2;
  margin-block-start: 50px;
}

.error_message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 6px;
  width: 100%;
  font-size: 0.9rem;
  text-align: center;
}

.demo_credentials {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  width: 100%;
  margin-top: 10px;
  
  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: #0369a1;
    
    &:first-child {
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
  }
}
</style>