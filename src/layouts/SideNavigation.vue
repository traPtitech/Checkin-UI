<script setup lang="ts">
import { useRoute } from 'vue-router'

import SideNavigationButton from '@/components/SideNavigationButton.vue'

const route = useRoute()
</script>

<template>
  <nav class="flex flex-col py-2 pr-2">
    <SideNavigationButton :is-here="route.path === '/'" path="/" text="home" />
    <SideNavigationButton :is-here="route.path === '/about'" path="/about" text="about" />
  </nav>
</template>
