<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'
import LangSwitcher from './LangSwitcher.vue'
import AppModal from './AppModal.vue'
import LeadForm from './LeadForm.vue'
import GmeLogo from './GmeLogo.vue'
import { useModal } from '@/composables/useModal'

const { t } = useI18n()
const route = useRoute()
const { isOpen, open, close } = useModal()

const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/services', label: t('nav.services') },
  { to: '/projects', label: t('nav.projects') },
  { to: '/about', label: t('nav.about') },
  { to: '/contact', label: t('nav.contact') },
])

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(to)
}

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

// Close mobile nav on route change
watch(() => route.path, () => { mobileOpen.value = false })
</script>

<template>
  <header
    class="app-header"
    :class="{ 'app-header--scrolled': scrolled }"
    role="banner"
  >
    <div class="container app-header__inner">
      <!-- Wordmark logo -->
      <RouterLink to="/" class="app-header__logo" aria-label="GME Technologies — bosh sahifa">
        <span class="app-header__logo-brand">
          <GmeLogo :size="28" class="app-header__logo-icon" />
          <span class="app-header__wordmark-group">
            <span class="app-header__wordmark">GME</span>
            <span class="app-header__wordmark-sub">Technologies</span>
          </span>
        </span>
      </RouterLink>

      <!-- Desktop nav -->
      <nav class="app-header__nav" aria-label="Asosiy navigatsiya">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="app-header__link"
          :class="{ 'app-header__link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Right controls -->
      <div class="app-header__actions">
        <LangSwitcher />
        <button class="btn btn--accent" @click="open">
          {{ t('cta.request') }}
        </button>
        <!-- Mobile burger -->
        <button
          class="app-header__burger"
          :aria-expanded="mobileOpen"
          aria-controls="mobile-nav"
          :aria-label="mobileOpen ? 'Menyuni yopish' : 'Menyuni ochish'"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="app-header__burger-bar" :class="{ open: mobileOpen }"></span>
          <span class="app-header__burger-bar" :class="{ open: mobileOpen }"></span>
          <span class="app-header__burger-bar" :class="{ open: mobileOpen }"></span>
        </button>
      </div>
    </div>

    <!-- Mobile nav drawer -->
    <nav
      id="mobile-nav"
      class="app-header__mobile-nav"
      :class="{ 'app-header__mobile-nav--open': mobileOpen }"
      aria-label="Mobil navigatsiya"
    >
      <div class="container app-header__mobile-inner">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="app-header__mobile-link"
          :class="{ 'app-header__mobile-link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
        <div class="app-header__mobile-actions">
          <LangSwitcher />
          <button class="btn btn--accent" @click="open">
            {{ t('cta.request') }}
          </button>
        </div>
      </div>
    </nav>
  </header>

  <!-- Modal: Lead form -->
  <AppModal :is-open="isOpen" @close="close" :title="t('form.title')">
    <LeadForm @success="close" />
  </AppModal>
</template>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-header);
  background: var(--color-paper);
  border-bottom: 1px solid transparent;
  transition:
    border-color 0.3s var(--ease-out),
    padding 0.3s var(--ease-out),
    background 0.3s var(--ease-out);
  padding-block: 1.5rem;
}

.app-header--scrolled {
  border-bottom-color: var(--color-border-light);
  padding-block: 0.875rem;
  background: rgba(244, 242, 238, 0.95);
  backdrop-filter: blur(8px);
}

.app-header__inner {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.app-header__logo {
  text-decoration: none;
  flex-shrink: 0;
}

.app-header__logo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
}

.app-header__logo-icon {
  display: block;
  flex-shrink: 0;
  transition: transform 0.3s var(--ease-out);
}

.app-header__logo:hover .app-header__logo-icon {
  transform: scale(1.08);
}

.app-header__wordmark-group {
  display: inline-flex;
  align-items: baseline;
  gap: 0.35rem;
}

.app-header__wordmark {
  font-size: 1.3125rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  line-height: 1;
}

.app-header__wordmark-sub {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
  line-height: 1;
}

.app-header__nav {
  display: none;
  align-items: center;
  gap: 1.75rem;
  margin-left: auto;
}

@media (min-width: 1024px) {
  .app-header__nav {
    display: flex;
  }
}

.app-header__link {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: none;
  letter-spacing: -0.01em;
  transition: color var(--duration) var(--ease-out), font-weight var(--duration) var(--ease-out);
  position: relative;
  padding-block: 0.25rem;
}

.app-header__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s var(--ease-out);
}

.app-header__link:hover,
.app-header__link--active {
  color: var(--color-ink);
}

.app-header__link--active {
  font-weight: 700;
}

.app-header__link:hover::after,
.app-header__link--active::after {
  transform: scaleX(1);
}

.app-header__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
}

@media (min-width: 1024px) {
  .app-header__actions {
    margin-left: 0;
  }
}

/* Burger button */
.app-header__burger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 2.75rem;
  height: 2.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
}

@media (min-width: 1024px) {
  .app-header__burger {
    display: none;
  }
}

.app-header__burger-bar {
  display: block;
  width: 100%;
  height: 1.5px;
  background: var(--color-ink);
  transition: transform 0.25s var(--ease-out), opacity 0.25s var(--ease-out);
  transform-origin: center;
}

.app-header__burger-bar:nth-child(1).open { transform: translateY(6.5px) rotate(45deg); }
.app-header__burger-bar:nth-child(2).open { opacity: 0; }
.app-header__burger-bar:nth-child(3).open { transform: translateY(-6.5px) rotate(-45deg); }

/* Mobile nav */
.app-header__mobile-nav {
  display: block;
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.4s var(--ease-out);
  border-top: 1px solid transparent;
}

.app-header__mobile-nav--open {
  max-height: 100vh;
  border-top-color: var(--color-border-light);
}

@media (min-width: 1024px) {
  .app-header__mobile-nav { display: none; }
}

.app-header__mobile-inner {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-block: 1rem 1.5rem;
}

.app-header__mobile-link {
  display: block;
  padding: 0.875rem 0;
  font-size: 1.0625rem;
  font-weight: 500;
  color: var(--color-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--color-border-light);
  letter-spacing: -0.01em;
  transition: color var(--duration) var(--ease-out), font-weight var(--duration) var(--ease-out);
}

.app-header__mobile-link--active {
  color: var(--color-ink);
  font-weight: 700;
}

.app-header__mobile-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1.5rem;
}

/* ─── Global Btn styles ─────────────────────────────────────────────────── */
</style>
