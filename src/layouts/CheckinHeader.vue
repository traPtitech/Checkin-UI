<script setup lang="ts">
import { Bars3Icon } from '@heroicons/vue/24/outline'
import { RouterLink } from 'vue-router'

import { useModal } from '@/components/modal/composables/useModal'
import ModalWrapper from '@/components/modal/ModalWrapper.vue'
import SideNavigation from '@/layouts/SideNavigation.vue'

const { shouldShowModal, closeModal, toggleModal } = useModal()
</script>

<template>
  <header class="flex gap-2 h-12 w-full items-center pl-2 shadow-sm">
    <button class="flex items-center md:hidden" @click="toggleModal">
      <Bars3Icon class="size-8" />
    </button>
    <RouterLink to="/">
      <img alt="Vue logo" class="size-8" src="@/assets/logo.svg" />
    </RouterLink>
    <ModalWrapper v-if="shouldShowModal" @click-outside="closeModal">
      <SideNavigation
        class="fixed left-0 top-12 h-full w-1/2 bg-background-default-default"
        @click-link="closeModal"
      />
    </ModalWrapper>
  </header>
</template>
