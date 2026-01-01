<script setup lang="ts">
import { parseRedirectQuery } from '@/composable/parseRouteQuery'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { isLoggedIn } = storeToRefs(authStore)
const { login } = authStore

const redirectTo = parseRedirectQuery(route.query.redirect)

const traqIdInput = ref('')

const handleLogin = () => {
  if (traqIdInput.value) {
    login(traqIdInput.value)
    router.push(redirectTo)
  } else {
    alert('traQ ID を入力してください。')
  }
}

const redirectIfLoggedIn = () => {
  if (isLoggedIn.value) {
    router.push(redirectTo)
  }
}

onMounted(redirectIfLoggedIn)
</script>

<template>
  <div v-if="isLoggedIn">
    <p>既にログイン済みです。リダイレクトします。</p>
  </div>
  <div v-else>
    <h1>ログイン</h1>
    <p>traQ OAuth でログインします。(現在はダミー実装です)</p>
    <div>
      <label for="traqId">traQ ID:</label>
      <input type="text" id="traqId" v-model="traqIdInput" />
    </div>
    <button @click="handleLogin">ログインする</button>
  </div>
</template>
