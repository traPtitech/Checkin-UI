<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import MemberShipPageVerifyEmailLink from '@/pages/membership/MembershipPageVerifyEmailLink.vue'
import MemberShipPageUserTypeSelector from './MemberShipPageUserTypeSelector.vue'
import MembershipPageLoginLink from './MembershipPageLoginLink.vue'

const route = useRoute()

const isLoggedIn = ref(false)
const hasIsctAddress = ref(false)
const hasCustomerObjectOnTraqId = ref(false)
const isUserTypeActive = computed(() => route.query.user_type === 'active')
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="isLoggedIn">
      <div v-if="!hasCustomerObjectOnTraqId && !hasIsctAddress">
        isct アドレスの認証が必要です
        <MemberShipPageVerifyEmailLink />
      </div>
      <div v-else>請求書情報入力へ</div>
    </div>
    <div v-else>
      <MemberShipPageUserTypeSelector />
      <div v-if="isUserTypeActive">
        ログインが必要です
        <MembershipPageLoginLink />
      </div>
      <div v-else-if="!hasIsctAddress">
        isct アドレスの認証が必要です <MemberShipPageVerifyEmailLink />
      </div>
      <div v-else>請求書情報入力へ</div>
    </div>
  </div>
</template>
