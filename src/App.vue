<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="app-root">
    <a href="#main-content" class="skip-link">
      Asosiy qismga o‘tish
    </a>

    <AppHeader />

    <main id="main-content" class="main-content">
      <RouterView />
    </main>

    <AppFooter />
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
