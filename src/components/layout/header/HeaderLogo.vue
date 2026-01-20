<template>
  <router-link to="/" class="lg:hidden">
    <img class="dark:hidden scale-100" width="80" src="/images/logo/logo.png" alt="Logo" />
    <img class="hidden dark:block scale-100" width="80" src="/images/logo/auth-logo.png" alt="Logo" />
  </router-link>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
