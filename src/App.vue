<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { RouterLink, RouterView } from 'vue-router'

import { useModal } from '@/components/modal/composables/useModal'
import ModalWrapper from '@/components/modal/ModalWrapper.vue'
import SideDrawer from '@/layouts/SideDrawer.vue'
import SideNavigation from '@/layouts/SideNavigation.vue'

const { shouldShowModal, closeModal, handleOpenModal } = useModal()
</script>

<template>
  <header class="flex gap-2 h-12 w-full items-center pl-2 shadow">
    <button class="flex items-center md:hidden" @click="handleOpenModal">
      <Bars3Icon class="size-8" />
    </button>
    <RouterLink to="/">
      <img alt="Vue logo" class="size-8" src="@/assets/logo.svg" />
    </RouterLink>
  </header>
  <ModalWrapper v-if="shouldShowModal" @close-modal="closeModal">
    <SideDrawer />
  </ModalWrapper>
  <div class="flex">
    <SideNavigation class="hidden md:block" />
    <RouterView />
  </div>
</template>
