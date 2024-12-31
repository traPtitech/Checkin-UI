<script lang="ts" setup>
interface Props {
  isHere: boolean
  path: string
  text: string
}

const props = defineProps<Props>()
</script>

<template>
  <router-link :class="props.isHere ? 'cursor-default' : ''" :to="props.path">
    <div
      class="rounded-r-3xl px-4 py-2"
      :class="
        props.isHere
          ? 'bg-background-brand-secondary-hover'
          : 'hover:bg-background-default-secondary-hover'
      "
    >
      <span>{{ props.text }}</span>
    </div>
  </router-link>
</template>
