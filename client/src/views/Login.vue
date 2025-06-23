<template>
  <div class="login_container">
    <LoginScreen @submit="submit($event)" :loading="loading" :error="error" />
  </div>
</template>

<script>
// SCREEN
import LoginScreen from '@/components/screens/login/LoginScreen.vue'
//STORE
import { useUserStore } from '@/stores/user'
export default {
  name: 'Login',
  components: {
    LoginScreen
  },
  data() {
    return {
      loading: false,
      error: null
    }
  },
  methods: {
    submit(credentials) {
      this.loading = true
      this.error = null
      
      const store = useUserStore()
      store.login(credentials, (success, error) => {
        this.loading = false
        
        if (success) {
          this.$router.push({ name: 'home' })
        } else {
          this.error = error || 'Login failed. Please try again.'
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login_container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  height: 100vh;
}
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