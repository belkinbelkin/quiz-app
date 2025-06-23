<template>
  <form class="login_form" @submit.prevent="submit">
    <BaseInput v-model="userName" label="Username" />
    <BaseInput v-model="password" label="Password" type="password" />
    <BaseButton type="submit" fullWidth>Log in</BaseButton>
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
  data() {
    return {
      userName: '',
      password: ''
    }
  },
  methods: {
    submit() {
      console.log('submit', {
        userName: this.userName,
        password: this.password
      })
      this.$emit('submit', {
        userName: this.userName,
        password: this.password
      })
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
</style>
