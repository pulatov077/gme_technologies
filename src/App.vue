<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import AiChatWidget from '@/components/AiChatWidget.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.name === 'admin')
</script>

<template>
  <div class="app-root" :class="{ 'app-root--admin': isAdminRoute }">
    <a v-if="!isAdminRoute" href="#main-content" class="skip-link">
      Asosiy qismga o‘tish
    </a>

    <AppHeader v-if="!isAdminRoute" />

    <main id="main-content" class="main-content" :class="{ 'main-content--admin': isAdminRoute }">
      <RouterView />
    </main>

    <AppFooter v-if="!isAdminRoute" />

    <AiChatWidget v-if="!isAdminRoute" />
  </div>
</template>

<style scoped>
.app-root {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1 0 auto;
  padding-top: 5rem;
}

.main-content--admin {
  padding-top: 0 !important;
}

.skip-link {
  position: absolute;
  top: -100px;
  left: 1rem;
  z-index: 999;
  background: var(--color-accent);
  color: #fff;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 2px;
  text-decoration: none;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 1rem;
}
</style>
