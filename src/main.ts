import './assets/main.css'

import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import uz from './locales/uz'
import ru from './locales/ru'
import en from './locales/en'
import type { Locale } from './types'

const STORAGE_KEY = 'gme-lang'

const savedLang = (localStorage.getItem(STORAGE_KEY) as Locale | null) ?? 'uz'

const i18n = createI18n({
  legacy: false,
  locale: savedLang,
  fallbackLocale: 'uz',
  messages: { uz, ru, en },
})

const app = createApp(App)
app.use(router)
app.use(i18n)
app.mount('#app')
