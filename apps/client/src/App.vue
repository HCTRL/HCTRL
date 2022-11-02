<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router"
import HelloWorld from "./components/HelloWorld.vue"
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/LEDTest">LEDTest</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>

</style>
