<template>
  <div id="app">
    <AppHeader />
    <main class="main_content">
      <RouterView />
    </main>
  </div>
</template>

<script>
import AppHeader from '@/components/layout/AppHeader.vue'

export default {
  name: 'App',
  components: {
    AppHeader
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main_content {
  flex: 1;
  overflow-y: auto;
}

/* Global button styles consistency */
button {
  font-family: inherit;
}

/* Ensure consistent focus styles */
button:focus,
input:focus,
select:focus {
  outline: 2px solid #5a9b8e;
  outline-offset: 2px;
}
</style>