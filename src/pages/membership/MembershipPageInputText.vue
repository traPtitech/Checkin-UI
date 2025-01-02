<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

const model = defineModel<string>({ required: true })
const { autoFocus, className, required, placeholder } = withDefaults(
  defineProps<{
    autoFocus?: boolean
    className?: string
    required?: boolean
    placeholder?: string
  }>(),
  {
    autoFocus: false,
    className: 'rounded border px-1',
    required: false,
    placeholder: '',
  },
)
const inputRef = useTemplateRef('input-ref')

onMounted(() => {
  if (autoFocus) {
    inputRef.value?.focus()
  }
})
</script>

<template>
  <input
    ref="input-ref"
    :class="className"
    :placeholder="placeholder"
    :required="required"
    v-model="model"
  />
</template>
