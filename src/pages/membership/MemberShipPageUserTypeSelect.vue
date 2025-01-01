<script setup lang="ts">
import type { UserType } from './types/userType'

const getUserTypeSelectURL = (userType: UserType) => {
  return {
    name: 'membership',
    query: { user_type: userType },
  }
}
</script>

<template>
  <div class="flex gap-2">
    <RouterLink :to="getUserTypeSelectURL('new')"> 新規入部 </RouterLink>
    <RouterLink :to="getUserTypeSelectURL('rejoin')"> 再入部 </RouterLink>
    <RouterLink :to="getUserTypeSelectURL('active')"> 継続所属 </RouterLink>
  </div>
</template>
