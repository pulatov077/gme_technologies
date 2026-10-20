<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/types'

const { locale } = useI18n()

const isOpen = ref(false)
const rootRef = ref<HTMLElement | null>(null)

interface LangOption {
  code: Locale
  label: string
  nativeName: string
  flag: string
}

const languages: LangOption[] = [
  { code: 'uz', label: 'UZ', nativeName: 'O‘zbekcha', flag: '🇺🇿' },
  { code: 'ru', label: 'RU', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'en', label: 'EN', nativeName: 'English', flag: '🇬🇧' },
]

const currentLanguage = computed<LangOption>(() => {
  return languages.find((l) => l.code === locale.value) ?? languages[0]!
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function selectLanguage(lang: Locale) {
  locale.value = lang
  localStorage.setItem('gme-lang', lang)
  document.documentElement.lang = lang
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div ref="rootRef" class="lang-dropdown" :class="{ 'lang-dropdown--open': isOpen }">
    <!-- Trigger Button -->
    <button
      type="button"
      class="lang-trigger"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      aria-label="Tilni tanlash / Выбор языка / Select language"
      @click.stop="toggleDropdown"
    >
      <span class="lang-trigger__globe" aria-hidden="true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </span>
      <span class="lang-trigger__code">{{ currentLanguage.label }}</span>
      <span class="lang-trigger__chevron" aria-hidden="true" :class="{ 'lang-trigger__chevron--rotated': isOpen }">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </span>
    </button>

    <!-- Dropdown Menu -->
    <Transition name="lang-fade">
      <ul
        v-if="isOpen"
        class="lang-menu"
        role="listbox"
        tabindex="-1"
      >
        <li
          v-for="lang in languages"
          :key="lang.code"
          class="lang-menu__item"
          :class="{ 'lang-menu__item--active': locale === lang.code }"
          role="option"
          :aria-selected="locale === lang.code"
          @click="selectLanguage(lang.code)"
        >
          <span class="lang-menu__flag">{{ lang.flag }}</span>
          <span class="lang-menu__name">{{ lang.nativeName }}</span>
          <span class="lang-menu__code">({{ lang.label }})</span>
          <span v-if="locale === lang.code" class="lang-menu__check" aria-hidden="true">✓</span>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<style scoped>
.lang-dropdown {
  position: relative;
  display: inline-block;
  user-select: none;
}

/* Trigger button */
.lang-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.45rem 0.75rem;
  background: rgba(11, 15, 20, 0.04);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  color: var(--color-ink);
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  outline: none;
}

.lang-trigger:hover,
.lang-dropdown--open .lang-trigger {
  background: rgba(11, 15, 20, 0.08);
  border-color: rgba(11, 15, 20, 0.25);
  color: var(--color-ink);
}

.lang-trigger__globe {
  display: flex;
  align-items: center;
  color: var(--color-muted);
  transition: color 0.2s var(--ease-out);
}

.lang-trigger:hover .lang-trigger__globe,
.lang-dropdown--open .lang-trigger__globe {
  color: var(--color-accent);
}

.lang-trigger__code {
  font-variant-numeric: tabular-nums;
}

.lang-trigger__chevron {
  display: flex;
  align-items: center;
  color: var(--color-muted);
  transition: transform 0.25s var(--ease-out), color 0.2s var(--ease-out);
}

.lang-trigger__chevron--rotated {
  transform: rotate(180deg);
  color: var(--color-accent);
}

/* Dropdown Menu */
.lang-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 170px;
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 6px;
  box-shadow: 0 10px 30px rgba(11, 15, 20, 0.12), 0 2px 6px rgba(11, 15, 20, 0.04);
  list-style: none;
  margin: 0;
  padding: 0.375rem;
  z-index: 1000;
  transform-origin: top right;
}

.lang-menu__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--color-ink);
  cursor: pointer;
  transition: background 0.15s var(--ease-out), color 0.15s var(--ease-out);
}

.lang-menu__item:hover {
  background: rgba(11, 15, 20, 0.06);
}

.lang-menu__item--active {
  background: rgba(255, 77, 0, 0.08);
  color: var(--color-accent);
  font-weight: 700;
}

.lang-menu__flag {
  font-size: 1rem;
  line-height: 1;
}

.lang-menu__name {
  flex-grow: 1;
}

.lang-menu__code {
  font-size: 0.6875rem;
  color: var(--color-muted);
  text-transform: uppercase;
}

.lang-menu__item--active .lang-menu__code {
  color: var(--color-accent);
}

.lang-menu__check {
  font-size: 0.8125rem;
  font-weight: 800;
  color: var(--color-accent);
}

/* Transition */
.lang-fade-enter-active,
.lang-fade-leave-active {
  transition: opacity 0.18s var(--ease-out), transform 0.18s var(--ease-out);
}

.lang-fade-enter-from,
.lang-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.97);
}

/* Dark context (Footer) styling */
:deep(.app-footer) .lang-trigger,
.app-footer .lang-trigger {
  background: rgba(244, 242, 238, 0.08);
  border-color: rgba(244, 242, 238, 0.15);
  color: var(--color-paper);
}

:deep(.app-footer) .lang-trigger:hover,
:deep(.app-footer) .lang-dropdown--open .lang-trigger,
.app-footer .lang-trigger:hover,
.app-footer .lang-dropdown--open .lang-trigger {
  background: rgba(244, 242, 238, 0.14);
  border-color: rgba(244, 242, 238, 0.3);
  color: #ffffff;
}

:deep(.app-footer) .lang-trigger__globe,
:deep(.app-footer) .lang-trigger__chevron,
.app-footer .lang-trigger__globe,
.app-footer .lang-trigger__chevron {
  color: rgba(244, 242, 238, 0.5);
}

:deep(.app-footer) .lang-menu,
.app-footer .lang-menu {
  top: auto;
  bottom: calc(100% + 6px);
  transform-origin: bottom right;
  background: #141a22;
  border-color: rgba(244, 242, 238, 0.15);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.5);
}

:deep(.app-footer) .lang-menu__item,
.app-footer .lang-menu__item {
  color: var(--color-paper);
}

:deep(.app-footer) .lang-menu__item:hover,
.app-footer .lang-menu__item:hover {
  background: rgba(244, 242, 238, 0.08);
}

:deep(.app-footer) .lang-menu__item--active,
.app-footer .lang-menu__item--active {
  background: rgba(255, 77, 0, 0.15);
  color: var(--color-accent);
}
</style>
