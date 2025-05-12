import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export const useVerifiedEmailStore = defineStore('verifiedEmail', () => {
  const _verifiedEmail = ref<string | null>(null)

  const verifiedEmail = readonly(_verifiedEmail)
  const hasVerifiedEmail = computed(() => _verifiedEmail.value !== null)

  const setVerifiedEmail = (verifiedEmail: string) => {
    _verifiedEmail.value = verifiedEmail
  }

  const clearEmail = () => {
    _verifiedEmail.value = null
  }

  return { verifiedEmail, hasVerifiedEmail, setVerifiedEmail, clearEmail }
})
