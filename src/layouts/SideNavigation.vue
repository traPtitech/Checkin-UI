<script setup lang="ts">
import { useRoute } from 'vue-router'

import SideNavigationButton from '@/layouts/SideNavigationButton.vue'

defineEmits(['clickLink'])
const route = useRoute()
</script>

<template>
  <nav class="flex flex-col gap-2 py-2 pr-2">
    <SideNavigationButton
      :is-here="route.path === '/'"
      path="/"
      text="home"
      @click="$emit('clickLink')"
    />
    <SideNavigationButton
      :is-here="route.path === '/membership'"
      path="/membership"
      text="membership"
      @click="$emit('clickLink')"
    />
  </nav>
</template>
