import { defineStore } from 'pinia'
import { computed, readonly, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const _loggedInTraqId = ref<{ traqId: string } | null>(null)

  const loggedInTraqId = readonly(_loggedInTraqId)
  const isLoggedIn = computed(() => _loggedInTraqId.value !== null)

  const login = (traqId: string) => {
    _loggedInTraqId.value = { traqId }
  }

  const logout = () => {
    _loggedInTraqId.value = null
  }

  return { isLoggedIn, loggedInTraqId, login, logout }
})
