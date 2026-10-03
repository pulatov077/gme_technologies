<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/types'

const { locale, t } = useI18n()

const locales: Locale[] = ['uz', 'ru', 'en']

function setLocale(lang: Locale) {
  locale.value = lang
  localStorage.setItem('gme-lang', lang)
  document.documentElement.lang = lang
}
</script>

<template>
  <div class="lang-switcher" role="group" :aria-label="'Til tanlash'">
    <button
      v-for="lang in locales"
      :key="lang"
      class="lang-switcher__btn"
      :class="{ 'lang-switcher__btn--active': locale === lang }"
      :aria-pressed="locale === lang"
      @click="setLocale(lang)"
    >
      {{ t(`lang.${lang}`) }}
    </button>
  </div>
</template>

<style scoped>
.lang-switcher {
  display: flex;
  align-items: center;
  gap: 0.125rem;
}

.lang-switcher__btn {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.375rem;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-muted);
  border-radius: 2px;
  transition: color var(--duration) var(--ease-out);
  min-width: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lang-switcher__btn:hover {
  color: var(--color-ink);
}

.lang-switcher__btn--active {
  color: var(--color-accent);
}

/* Dark context (footer) */
:deep(.app-footer) .lang-switcher__btn {
  color: rgba(244, 242, 238, 0.4);
}

:deep(.app-footer) .lang-switcher__btn:hover {
  color: var(--color-paper);
}

:deep(.app-footer) .lang-switcher__btn--active {
  color: var(--color-accent);
}
</style>
