<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const getLoginPageURL = {
  path: '/login',
  query: { redirect: route.fullPath },
}
</script>

<template>
  <RouterLink :to="getLoginPageURL">ログインへ</RouterLink>
</template>
