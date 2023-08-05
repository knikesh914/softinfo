<template>
<div :class="themeClass">
  <router-view/>
  </div>
</template>
<script>
import "@/assets/custome.css";
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['darkTheme']),
    themeClass() {
      return this.darkTheme ? 'darkTheme' : 'lightTheme';
    },
  },
  methods: {
    ...mapActions(['toggleTheme']),
  },
  watch: {
    darkTheme: {
      immediate: true,
      handler(newVal) {
        document.body.classList.toggle('dark-theme', newVal);
      },
    },
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body {
  font-family: 'Roboto', sans-serif;
  background-color: var(--defaultBg);
}

/* Styles for the dark theme */
body.dark-theme {
  background-color: black;
}
</style>
