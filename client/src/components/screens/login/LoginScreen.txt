<template>
  <main class="login_content">
    <Logo />
    <LoginForm @submit="submit($event)" :loading="loading" :error="error" />
  </main>
</template>

<script>
// COMPONENTS
import Logo from '@/components/base/logo/Logo.vue'
import LoginForm from '@/components/compositions/forms/login/LoginForm.vue'

export default {
  name: 'LoginScreen',
  emits: ['submit'],
  components: {
    Logo,
    LoginForm
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
  methods: {
    submit(credentials) {
      this.$emit('submit', credentials)
    }
  }
}
</script>

<style lang="scss" scoped>
.login_content {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  max-width: 782px;
  background: #fff;
  box-shadow: 0px 4px 4px 3px rgba(185, 185, 185, 0.2509803922);
  flex-direction: column;
  padding: 35px 0;
  height: -webkit-fill-available;
}
</style>