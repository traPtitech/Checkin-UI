<script lang="ts" setup>
interface Props {
  isHere: boolean
  path: string
  text: string
}

const { isHere, path, text } = defineProps<Props>()
</script>

<template>
  <router-link :class="isHere ? 'cursor-default' : ''" :to="path">
    <div
      class="rounded-r-3xl px-4 py-2"
      :class="
        isHere
          ? 'bg-background-brand-secondary-hover'
          : 'hover:bg-background-default-secondary-hover'
      "
    >
      <span>{{ text }}</span>
    </div>
  </router-link>
</template>
