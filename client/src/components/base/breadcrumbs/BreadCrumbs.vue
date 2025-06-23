<template>
  <ol class="breadcrumbs">
    <li class="link" v-for="(item, index) in items" :key="index">
      <span class="text"> / </span>
      <router-link v-if="item.to" class="link" :to="item.to">{{ item.text }}</router-link>
      <span v-else class="text">{{ item.text }}</span>
    </li>
  </ol>
</template>

<script>
import Logo from '@/components/base/logo/Logo.vue'
export default {
  name: 'Breadcrumbs',
  components: {
    Logo
  },
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [{ text: 'Item', to: '/' }]
    },
    color: {
      type: String,
      required: false,
      default: 'black'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/utilities/css/vars/vars.scss';
.breadcrumbs {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  font-size: 18px;
}
.link {
  font-family: $FONT-BOLD;
  text-decoration: none;
  white-space: nowrap;
  color: v-bind(color);
  padding-inline-start: 3px;
}
.text {
  font-family: $FONT-REGULAR;
  text-decoration: none;
  white-space: nowrap;
  color: v-bind(color);
}
</style>
