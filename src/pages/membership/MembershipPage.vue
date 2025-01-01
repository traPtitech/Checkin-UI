<script setup lang="ts">
import { useRoute } from 'vue-router'

import MemberShipPageUserTypeSelect from './MemberShipPageUserTypeSelect.vue'

const route = useRoute()
</script>

<template>
  <div class="flex flex-col gap-2">
    <MemberShipPageUserTypeSelect />
    <div>route.query.user_type: {{ route.query.user_type }}</div>
  </div>
</template>
