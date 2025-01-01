<script setup lang="ts">
import { RouterView } from 'vue-router'

import CheckinHeader from '@/layouts/CheckinHeader.vue'
import SideNavigation from '@/layouts/SideNavigation.vue'
</script>

<template>
  <CheckinHeader />
  <div class="flex">
    <div class="hidden md:block">
      <SideNavigation />
    </div>
    <RouterView />
  </div>
</template>
