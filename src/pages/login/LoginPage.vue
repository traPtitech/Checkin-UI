<script setup lang="ts">
import { parseRouteQuery } from '@/composable/parseRouteQuery'
import { useRoute } from 'vue-router'

const route = useRoute()
const redirectParams = parseRouteQuery(route.query.redirect)
</script>

<template>
  <RouterLink :to="redirectParams[0]"> ログインする </RouterLink>
</template>
