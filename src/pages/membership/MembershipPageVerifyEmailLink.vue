<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const getVerifyEmailPageURL = {
  path: '/verify-email',
  query: { redirect: route.fullPath },
}
</script>

<template>
  <RouterLink :to="getVerifyEmailPageURL">isct アドレスの認証へ</RouterLink>
</template>
