<script setup lang="ts">
import MemberShipPageUserTypeSelectorButton from './MemberShipPageUserTypeSelectorButton.vue'
</script>

<template>
  <div class="flex gap-2">
    <MemberShipPageUserTypeSelectorButton userType="new">
      新規入部
    </MemberShipPageUserTypeSelectorButton>
    <MemberShipPageUserTypeSelectorButton userType="rejoin">
      再入部
    </MemberShipPageUserTypeSelectorButton>
    <MemberShipPageUserTypeSelectorButton userType="active">
      継続所属
    </MemberShipPageUserTypeSelectorButton>
  </div>
</template>
