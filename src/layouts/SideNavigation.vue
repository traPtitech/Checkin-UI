<script setup lang="ts">
import { useRoute } from 'vue-router'

import SideNavigationButton from '@/layouts/SideNavigationButton.vue'

const route = useRoute()
</script>

<template>
  <nav class="flex flex-col gap-2 py-2 pr-2">
    <SideNavigationButton :is-here="route.path === '/'" path="/" text="home" />
    <SideNavigationButton :is-here="route.path === '/about'" path="/about" text="about" />
  </nav>
</template>
