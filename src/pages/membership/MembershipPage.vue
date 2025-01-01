<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import MemberShipPageVerifyEmailLink from '@/pages/membership/MembershipPageVerifyEmailLink.vue'
import MemberShipPageUserTypeSelector from './MemberShipPageUserTypeSelector.vue'
import MembershipPageLoginLink from './MembershipPageLoginLink.vue'

const route = useRoute()

const isUserTypeNew = computed(() => route.query.user_type === 'new')
const isUserTypeRejoin = computed(() => route.query.user_type === 'rejoin')
const isUserTypeActive = computed(() => route.query.user_type === 'active')
const isUserTypeQueryValid = computed(
  () => isUserTypeNew.value || isUserTypeRejoin.value || isUserTypeActive.value,
)

const isLoggedIn = ref(false)
const hasVerifiedMailAddress = ref(false)
const hasCustomerObjectOnTraqId = ref(false)
const shouldShowUserTypeSelector = computed(() => !isLoggedIn.value)
const needUserTypeSelect = computed(() => !isLoggedIn.value && !isUserTypeQueryValid.value)
const needMailAddressInput = computed(
  () =>
    (isLoggedIn.value && !hasCustomerObjectOnTraqId.value && !hasVerifiedMailAddress.value) ||
    (!isLoggedIn.value &&
      (isUserTypeNew.value || isUserTypeRejoin.value) &&
      !hasVerifiedMailAddress.value),
)
const needLogin = computed(() => isUserTypeActive.value && !isLoggedIn.value)

const hasCustomerObjectOnMailAddress = ref(false)
const hasTraQIdOnCustomerObject = ref(false)
const hasCustomerObject = computed(
  () => hasCustomerObjectOnMailAddress.value || hasCustomerObjectOnTraqId.value,
)
const canShowInvoiceForm = computed(
  () =>
    (isLoggedIn.value && (hasCustomerObjectOnTraqId.value || hasVerifiedMailAddress.value)) ||
    (!isLoggedIn.value &&
      (isUserTypeNew.value || isUserTypeRejoin.value) &&
      hasVerifiedMailAddress.value),
)
const needTraqIdInput = computed(
  () =>
    isUserTypeRejoin.value &&
    (!hasCustomerObjectOnMailAddress.value || !hasTraQIdOnCustomerObject.value),
)
const needNameInput = computed(() => !hasCustomerObject.value)
const hasValidTraqId = computed(() => !needTraqIdInput.value && false)
const hasName = computed(() => !needNameInput.value && false)
const canShowInvoiceInfoConfirm = computed(
  () => needNameInput.value && hasValidTraqId.value && hasName.value,
)
</script>

<template>
  <div class="flex flex-col gap-2">
    <div v-if="shouldShowUserTypeSelector">
      <MemberShipPageUserTypeSelector />
    </div>
    <div v-if="needUserTypeSelect">新規入部、再入部、継続所属のいずれかを選択してください</div>
    <div v-if="needMailAddressInput">
      isct アドレスの認証が必要です <MemberShipPageVerifyEmailLink />
    </div>
    <div v-if="needLogin">
      ログインが必要です
      <MembershipPageLoginLink />
    </div>
    <div v-if="canShowInvoiceForm && needTraqIdInput">traQ ID を入力してください</div>
    <div v-if="canShowInvoiceForm && needNameInput">名前を入力してください</div>
    <div v-if="canShowInvoiceInfoConfirm">請求書発行のための情報を確認してください</div>
  </div>
</template>
