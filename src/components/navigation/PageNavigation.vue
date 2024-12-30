<script setup lang="ts">
import { useRoute } from 'vue-router'

import SideBarButton from '@/components/navigation/SideBarButton.vue'

const route = useRoute()
</script>

<template>
  <nav class="flex flex-col gap-2 py-2 pr-2">
    <SideBarButton :is-here="route.path === '/'" path="/" text="home" />
    <SideBarButton :is-here="route.path === '/about'" path="/about" text="about" />
  </nav>
</template>
