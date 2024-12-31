<script setup lang="ts">
const emit = defineEmits<{
  (e: 'closeModal'): void
}>()
</script>

<template>
  <teleport to="body">
    <div
      class="z-50 fixed top-0 left-0 size-full bg-background-default-secondary/50"
      @click.self="emit('closeModal')"
    >
      <slot />
    </div>
  </teleport>
</template>
