<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useVerifiedEmailStore } from '@/stores/verifiedEmail'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

import MemberShipPageVerifyEmailLink from '@/pages/membership/MembershipPageVerifyEmailLink.vue'
import { storeToRefs } from 'pinia'
import MemberShipPageUserTypeSelector from './MemberShipPageUserTypeSelector.vue'
import MembershipPageInputText from './MembershipPageInputText.vue'
import MembershipPageLoginLink from './MembershipPageLoginLink.vue'

const route = useRoute()
const { isLoggedIn, loggedInTraqId } = storeToRefs(useAuthStore())
const { verifiedEmail, hasVerifiedEmail } = storeToRefs(useVerifiedEmailStore())

const isUserTypeNew = computed(() => route.query.user_type === 'new')
const isUserTypeRejoin = computed(() => route.query.user_type === 'rejoin')
const isUserTypeActive = computed(() => route.query.user_type === 'active')
const isUserTypeQueryValid = computed(
  () => isUserTypeNew.value || isUserTypeRejoin.value || isUserTypeActive.value,
)

const hasCustomerObjectOnTraqId = ref(false)
const shouldShowUserTypeSelector = computed(() => !isLoggedIn.value)
const needUserTypeSelect = computed(() => !isLoggedIn.value && !isUserTypeQueryValid.value)
const needMailAddressInput = computed(
  () =>
    (isLoggedIn.value && !hasCustomerObjectOnTraqId.value && !hasVerifiedEmail.value) ||
    (!isLoggedIn.value &&
      (isUserTypeNew.value || isUserTypeRejoin.value) &&
      !hasVerifiedEmail.value),
)
const needLogin = computed(() => isUserTypeActive.value && !isLoggedIn.value)

const hasCustomerObjectOnMailAddress = ref(false)
const hasTraQIdOnCustomerObject = ref(false)
const hasCustomerObject = computed(
  () => hasCustomerObjectOnMailAddress.value || hasCustomerObjectOnTraqId.value,
)
const canShowInvoiceForm = computed(
  () =>
    (isLoggedIn.value && (hasCustomerObjectOnTraqId.value || hasVerifiedEmail.value)) ||
    (!isLoggedIn.value &&
      (isUserTypeNew.value || isUserTypeRejoin.value) &&
      hasVerifiedEmail.value),
)
const needTraqIdInput = computed(
  () =>
    isUserTypeRejoin.value &&
    (!hasCustomerObjectOnMailAddress.value || !hasTraQIdOnCustomerObject.value),
)
const traqIdInput = ref('')
const needNameInput = computed(() => !hasCustomerObject.value)
const nameInput = ref('')
const hasValidTraqId = computed(() => !needTraqIdInput.value || traqIdInput.value.length > 0)
const hasName = computed(() => !needNameInput.value || nameInput.value.length > 0)
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
    <div v-if="needMailAddressInput" class="flex flex-col gap-2">
      isct アドレスの認証が必要です <MemberShipPageVerifyEmailLink />
    </div>
    <div v-if="needLogin" class="flex flex-col gap-2">
      ログインが必要です
      <MembershipPageLoginLink />
    </div>
    <div v-if="canShowInvoiceForm && needTraqIdInput" class="flex flex-col gap-2">
      traQ ID を入力してください
      <MembershipPageInputText v-model="traqIdInput" />
    </div>
    <div v-if="canShowInvoiceForm && needNameInput" class="flex flex-col gap-2">
      名前を入力してください
      <MembershipPageInputText v-model="nameInput" />
    </div>
    <div v-if="canShowInvoiceInfoConfirm">請求書発行のための情報を確認してください</div>
  </div>
</template>
