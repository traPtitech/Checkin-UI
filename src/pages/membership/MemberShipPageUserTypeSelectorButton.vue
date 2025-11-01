<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import type { UserType } from './types/userType'

const { userType } = defineProps<{ userType: UserType }>()

const route = useRoute()
const router = useRouter()
const replaceUserTypeQuery = (userType: UserType) => {
  const newQuery = { ...route.query, user_type: userType }
  router.replace({ query: newQuery })
}
</script>

<template>
  <button @click="replaceUserTypeQuery(userType)">
    <slot></slot>
  </button>
</template>
