<script setup lang="ts">
const emit = defineEmits<{
  (e: 'clickOutside'): void
}>()
</script>

<template>
  <teleport to="body">
    <div
      class="z-50 fixed top-0 left-0 size-full bg-background-default-secondary/50"
      @click.self="emit('clickOutside')"
    >
      <slot />
    </div>
  </teleport>
</template>
