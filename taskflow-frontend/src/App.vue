<script setup>
import { computed, onMounted } from 'vue'
import AppNavbar from './components/common/AppNavbar.vue'
import { useAuthStore } from './stores/auth.store'

const authStore = useAuthStore()

onMounted(() => {
  void authStore.checkSession()
})

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <AppNavbar
    v-if="isAuthenticated"
    :user="authStore.user"
    :is-admin="isAdmin"
    @logout="handleLogout"
  />

  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <component :is="Component" :key="route.fullPath" />
    </transition>
  </router-view>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
