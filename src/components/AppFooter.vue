<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import LangSwitcher from './LangSwitcher.vue'
import GmeLogo from './GmeLogo.vue'

const { t } = useI18n()

const year = computed(() => new Date().getFullYear())

const navLinks = computed(() => [
  { to: '/projects', label: t('nav.projects') },
  { to: '/services', label: t('nav.services') },
  { to: '/about', label: t('nav.about') },
  { to: '/contact', label: t('nav.contact') },
])

const legal = computed(() => t('footer.legal', { year: year.value }))
</script>

<template>
  <footer class="app-footer" role="contentinfo">
    <div class="container app-footer__inner">
      <!-- Top row -->
      <div class="app-footer__top">
        <!-- Brand -->
        <div class="app-footer__brand">
          <RouterLink to="/" class="app-footer__logo" aria-label="GME Technologies">
            <span class="app-footer__logo-brand">
              <GmeLogo :size="28" class="app-footer__logo-icon" />
              <span class="app-footer__wordmark">GME</span>
              <span class="app-footer__wordmark-sub">Technologies</span>
            </span>
          </RouterLink>
          <p class="app-footer__tagline">
            <!-- TODO: qisqa tavsif -->
            Samarqandan O'zbekiston bo'ylab raqamli yechimlar.
          </p>
        </div>

        <!-- Nav -->
        <nav class="app-footer__nav" aria-label="Qo'shimcha navigatsiya">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="app-footer__link"
          >
            {{ link.label }}
          </RouterLink>
        </nav>

        <!-- Contact block -->
        <address class="app-footer__contact">
          <p class="label app-footer__contact-label">{{ t('contact.title') }}</p>
          <!-- TODO: replace with real contact info -->
          <a href="tel:+998000000000" class="app-footer__contact-item">+998 00 000 00 00</a>
          <a href="mailto:info@gmetech.uz" class="app-footer__contact-item">
            info@gmetech.uz
          </a>
          <a
            href="https://t.me/gmetechnologies"
            target="_blank"
            rel="noopener noreferrer"
            class="app-footer__contact-item"
          >
            @gmetechnologies
          </a>
          <p class="app-footer__contact-item">{{ t('footer.address') }}</p>
          <p class="app-footer__contact-item app-footer__hours">{{ t('footer.workHours') }}</p>
        </address>
      </div>

      <!-- Divider -->
      <hr class="rule" />

      <!-- Bottom row -->
      <div class="app-footer__bottom">
        <p class="app-footer__legal">{{ legal }}</p>
        <LangSwitcher />
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background: var(--color-ink);
  color: var(--color-paper);
  padding-block: clamp(3rem, 8vw, 6rem) clamp(1.5rem, 4vw, 2.5rem);
}

.app-footer__inner {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.app-footer__top {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .app-footer__top {
    grid-template-columns: 2fr 1fr 1.5fr;
    gap: 3rem;
  }
}

/* Brand */
.app-footer__logo { text-decoration: none; }

.app-footer__logo-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.app-footer__logo-icon {
  transition: transform 0.3s var(--ease-out);
}

.app-footer__logo:hover .app-footer__logo-icon {
  transform: scale(1.08);
}

.app-footer__wordmark {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-paper);
  line-height: 1;
}

.app-footer__wordmark-sub {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(244, 242, 238, 0.5);
}

.app-footer__tagline {
  margin-top: 0.875rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(244, 242, 238, 0.5);
  max-width: 24ch;
}

/* Nav */
.app-footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.app-footer__link {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(244, 242, 238, 0.6);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
  width: fit-content;
}

.app-footer__link:hover { color: var(--color-paper); }

/* Contact */
.app-footer__contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-style: normal;
}

.app-footer__contact-label {
  color: rgba(244, 242, 238, 0.35);
  margin-bottom: 0.25rem;
}

.app-footer__contact-item {
  font-size: 0.875rem;
  color: rgba(244, 242, 238, 0.6);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
  line-height: 1.5;
}

a.app-footer__contact-item:hover { color: var(--color-paper); }

.app-footer__hours { margin-top: 0.25rem; }

/* Bottom */
.rule {
  border: none;
  border-top: 1px solid var(--color-border);
}

.app-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-footer__legal {
  font-size: 0.75rem;
  color: rgba(244, 242, 238, 0.35);
}
</style>
