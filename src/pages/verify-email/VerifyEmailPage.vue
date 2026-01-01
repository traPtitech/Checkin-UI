<script setup lang="ts">
import { parseRedirectQuery } from '@/composable/parseRouteQuery'
import { useVerifiedEmailStore } from '@/stores/verifiedEmail'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const verifiedEmailStore = useVerifiedEmailStore()
const { hasVerifiedEmail } = storeToRefs(verifiedEmailStore)
const { setVerifiedEmail } = verifiedEmailStore

const redirectTo = parseRedirectQuery(route.query.redirect)

const emailInput = ref('')

const handleVerifyEmail = () => {
  // ここで実際のメール送信と検証プロセスをシミュレートします。
  // 簡単のため、入力されたメールアドレスを検証済みとして扱います。
  if (emailInput.value && emailInput.value.endsWith('@isct.ac.jp')) {
    setVerifiedEmail(emailInput.value)
    router.push(redirectTo)
  } else {
    alert('有効な大学のメールアドレス (isct.ac.jp) を入力してください。')
  }
}

const redirectIfVerifiedEmailExists = () => {
  if (hasVerifiedEmail.value) {
    router.push(redirectTo)
  }
}

onMounted(redirectIfVerifiedEmailExists)
</script>

<template>
  <div v-if="!hasVerifiedEmail">
    <h1>メールアドレス認証</h1>
    <p>大学のメールアドレス (isct.ac.jp) を入力してください。</p>
    <p>メールを送信し、メールアドレスの所有者であることを確認します。(現在はダミー実装です)</p>
    <div>
      <label for="email">メールアドレス:</label>
      <input type="email" id="email" v-model="emailInput" placeholder="example@isct.ac.jp" />
    </div>
    <button @click="handleVerifyEmail">認証メールを送信する</button>
  </div>
  <div v-else>
    <p>メールアドレスは既に認証済みです。リダイレクトしています...</p>
  </div>
</template>
