<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/SectionHeading.vue'
import LeadForm from '@/components/LeadForm.vue'

const { t, locale } = useI18n()

interface ServiceDetail {
  id: string
  num: string
  titleKey: string
  descKey: string
  included: Record<'uz' | 'ru' | 'en', string[]>
  process: Record<'uz' | 'ru' | 'en', string>
}

const servicesData: ServiceDetail[] = [
  {
    id: 'websites',
    num: '01',
    titleKey: 'services.website',
    descKey: 'services.websiteDesc',
    included: {
      uz: [
        'Moslashuvchan dizayn (Mobile, Tablet, Desktop)',
        'Tezkor yuklanish (Core Web Vitals 95+)',
        'SEO va Open Graph tayyorgarligi',
        'Ma’muriyat paneli (CMS) yoki boshqaruv tizimi',
        'Xavfsizlik va SSL sertifikati',
      ],
      ru: [
        'Адаптивный дизайн (Mobile, Tablet, Desktop)',
        'Быстрая загрузка (Core Web Vitals 95+)',
        'SEO и Open Graph оптимизация',
        'Панель управления (CMS) или личный кабинет',
        'Безопасность и SSL-сертификат',
      ],
      en: [
        'Responsive design (Mobile, Tablet, Desktop)',
        'Fast loading speeds (Core Web Vitals 95+)',
        'SEO & Open Graph readiness',
        'Admin panel (CMS) or management portal',
        'High security & SSL encryption',
      ],
    },
    process: {
      uz: 'Analitika → Wireframe → UI/UX → Frontend & Backend → QA & Test → Deploy',
      ru: 'Аналитика → Прототип → UI/UX → Frontend & Backend → QA & Тестирование → Деплой',
      en: 'Discovery → Wireframing → UI/UX → Frontend & Backend → QA & Testing → Deployment',
    },
  },
  {
    id: 'telegram',
    num: '02',
    titleKey: 'services.telegram',
    descKey: 'services.telegramDesc',
    included: {
      uz: [
        'Telegram Web Apps (TWA) mini-ilovalar',
        'Click va Payme orqali to‘lov tizimlari integratsiyasi',
        'Mijozlar bilan avtomatik muloqot va AI yordamchi',
        'Ombor va CRM bilan ikki tomonlama sinxronizatsiya',
        'Tezkor xabar yuborish va reklama vositalari',
      ],
      ru: [
        'Мини-приложения Telegram Web Apps (TWA)',
        'Интеграция платежных систем Click и Payme',
        'Автоматическое общение с клиентами и AI-ассистент',
        'Двусторонняя синхронизация со складом и CRM',
        'Массовые рассылки и маркетинговые инструменты',
      ],
      en: [
        'Telegram Web Apps (TWA) mini-applications',
        'Click & Payme payment gateway integration',
        'Automated customer communications & AI assistant',
        'Two-way sync with warehouse and CRM systems',
        'Broadcast messaging and marketing automation',
      ],
    },
    process: {
      uz: 'Logika xaritasi → Bot arxitekturasi → Mini-app interfeysi → To‘lov sinovi → Ishga tushirish',
      ru: 'Карта логики → Архитектура бота → Интерфейс Mini-App → Тест оплаты → Запуск',
      en: 'Logic flow → Bot architecture → Mini App UI → Payment testing → Production rollout',
    },
  },
  {
    id: 'crm',
    num: '03',
    titleKey: 'services.crm',
    descKey: 'services.crmDesc',
    included: {
      uz: [
        'Savdo voronkasi va mijozlar bazasi boshqaruvi',
        'IP-telefoniya va SMS-xabarnomalar integratsiyasi',
        'Xodimlar KPI va hisobotlar avtomatizatsiyasi',
        '1C, bank hisoblari va yetkazib berish xizmatlari bilan ulanish',
        'Rol va kirish huquqlarini cheklash',
      ],
      ru: [
        'Управление воронкой продаж и клиентской базой',
        'Интеграция IP-телефонии и SMS-уведомлений',
        'Автоматизация KPI сотрудников и финансовой отчетности',
        'Связка с 1C, банковскими выписками и логистикой',
        'Разграничение ролей и прав доступа',
      ],
      en: [
        'Sales funnel and customer base management',
        'IP telephony and automated SMS notifications',
        'Employee KPI and financial reporting automation',
        'Integration with 1C, bank accounts, and courier services',
        'Role-based access control and data security',
      ],
    },
    process: {
      uz: 'Biznes-audit → Texnik topshiriq (TOR) → Tizimni sozlash/ishlab chiqish → Xodimlarni o‘qitish',
      ru: 'Бизнес-аудит → Техническое задание (ТЗ) → Разработка/настройка системы → Обучение команды',
      en: 'Business audit → Technical specification → Development/configuration → Staff training',
    },
  },
  {
    id: 'mobile',
    num: '04',
    titleKey: 'services.mobile',
    descKey: 'services.mobileDesc',
    included: {
      uz: [
        'iOS (App Store) va Android (Google Play) uchun ilovalar',
        'Push-xabarnomalar va geolokatsiya xizmatlari',
        'Offline rejimida ishlash imkoniyati',
        'Biometrik autentifikatsiya (FaceID, Fingerprint)',
        'Analitika va foydalanuvchilar harakati monitoringi',
      ],
      ru: [
        'Приложения для iOS (App Store) и Android (Google Play)',
        'Push-уведомления и сервисы геолокации',
        'Возможность работы в автономном (offline) режиме',
        'Биометрическая авторизация (FaceID, отпечаток)',
        'Аналитика и отслеживание действий пользователей',
      ],
      en: [
        'Apps for iOS (App Store) and Android (Google Play)',
        'Push notifications and geolocation services',
        'Offline storage and background sync',
        'Biometric authentication (FaceID, Fingerprint)',
        'Analytics and in-app behavior tracking',
      ],
    },
    process: {
      uz: 'Prototip → UI dizayn → Native/Flutter dasturlash → Backend integratsiya → Do‘konlarga nashr qilish',
      ru: 'Прототип → UI-дизайн → Native/Flutter разработка → Интеграция бэкенда → Публикация в сторах',
      en: 'Prototyping → UI design → Native/Flutter coding → Backend integration → App Store / Play Store release',
    },
  },
  {
    id: 'custom',
    num: '05',
    titleKey: 'services.custom',
    descKey: 'services.customDesc',
    included: {
      uz: [
        'Yuqori yuklamali arxitektura va mikroxizmatlar',
        'Maxsus algoritmlar va ma’lumotlar bazasi optimizatsiyasi',
        'Rest API va GraphQL shlyuzlari',
        'Avtomatlashtirilgan CI/CD va bulutli infratuzilma',
        'Loyiha kodiga to‘liq egalik huquqi',
      ],
      ru: [
        'Высоконагруженная архитектура и микросервисы',
        'Специализированные алгоритмы и оптимизация баз данных',
        'Шлюзы Rest API и GraphQL',
        'Автоматизированный CI/CD и облачная инфраструктура',
        'Полная передача авторских прав на код',
      ],
      en: [
        'High-load microservices architecture',
        'Custom algorithms and database optimization',
        'RESTful API and GraphQL endpoints',
        'Automated CI/CD pipelines & cloud infrastructure',
        'Complete source code and IP ownership transfer',
      ],
    },
    process: {
      uz: 'Arxitektura loyihalash → Sprint-asosli dasturlash → Load testing → Monitoring o‘rnatish',
      ru: 'Проектирование архитектуры → Спринты разработки → Нагрузочное тестирование → Мониторинг',
      en: 'Architecture design → Agile sprints → Load testing → Production monitoring',
    },
  },
]

const currentLocale = computed<'uz' | 'ru' | 'en'>(() => {
  return (locale.value === 'ru' || locale.value === 'en') ? locale.value : 'uz'
})

const detailedServices = computed(() => {
  const lang = currentLocale.value
  return servicesData.map((s) => ({
    id: s.id,
    num: s.num,
    titleKey: s.titleKey,
    descKey: s.descKey,
    included: s.included[lang] || s.included.uz,
    process: s.process[lang] || s.process.uz,
  }))
})
</script>

<template>
  <div class="services-page section-py">
    <div class="container">
      <SectionHeading
        :label="t('servicesPage.label')"
        :title="t('services.title')"
        :subtitle="t('services.subtitle')"
      />

      <div class="services-detail-list">
        <article
          v-for="serv in detailedServices"
          :key="serv.id"
          class="service-detail-card"
        >
          <div class="service-detail-card__header">
            <span class="service-num">{{ serv.num }}</span>
            <div class="service-title-wrap">
              <h2 class="h2 service-name">{{ t(serv.titleKey) }}</h2>
              <p class="service-short">{{ t(serv.descKey) }}</p>
            </div>
          </div>

          <div class="service-detail-grid">
            <!-- What's included -->
            <div class="detail-box">
              <h3 class="label text-accent">{{ t('servicesPage.includedTitle') }}</h3>
              <ul class="detail-list">
                <li v-for="(item, i) in serv.included" :key="i">
                  <span class="check-icon">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Typical process -->
            <div class="detail-box">
              <h3 class="label text-accent">{{ t('servicesPage.processTitle') }}</h3>
              <p class="process-flow">{{ serv.process }}</p>
              <div class="service-action">
                <a href="#request-service" class="btn btn--outline btn--sm">
                  {{ t('servicesPage.orderBtn') }}
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Service Request CTA -->
      <div id="request-service" class="services-cta-box">
        <div class="services-cta-info">
          <span class="label text-accent">{{ t('servicesPage.collabTag') }}</span>
          <h2 class="h2">{{ t('servicesPage.matchTitle') }}</h2>
          <p class="services-cta-desc">
            {{ t('servicesPage.matchDesc') }}
          </p>

          <div class="cta-quick-contacts">
            <div class="quick-contact-item">
              <span class="label">{{ t('ctaSection.phone') }}</span>
              <a href="tel:+998913131154" class="quick-contact-val">+998 91 313 11 54</a>
            </div>
            <div class="quick-contact-item">
              <span class="label">{{ t('ctaSection.telegram') }}</span>
              <a href="https://t.me/gme_technologies" target="_blank" rel="noopener noreferrer" class="quick-contact-val">@gme_technologies</a>
            </div>
            <div class="quick-contact-item">
              <span class="label">{{ t('ctaSection.address') }}</span>
              <span class="quick-contact-val">{{ t('ctaSection.addressVal') }}</span>
            </div>
          </div>
        </div>
        <div class="services-form-wrap">
          <LeadForm />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-detail-list {
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.service-detail-card {
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: clamp(1.25rem, 5vw, 3.5rem);
}

.service-detail-card__header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border-light);
}

@media (min-width: 768px) {
  .service-detail-card__header {
    flex-direction: row;
    align-items: flex-start;
    gap: 2.5rem;
  }
}

.service-num {
  font-size: 2rem;
  font-weight: 800;
  font-family: monospace;
  color: var(--color-accent);
}

.service-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-name {
  color: var(--color-ink);
}

.service-short {
  font-size: 1.125rem;
  color: var(--color-muted);
}

.service-detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  margin-top: 2.5rem;
}

@media (min-width: 768px) {
  .service-detail-grid {
    grid-template-columns: 1.2fr 1fr;
  }
}

.detail-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.9375rem;
  color: var(--color-ink);
  line-height: 1.5;
}

.check-icon {
  color: var(--color-accent);
  font-weight: 700;
}

.process-flow {
  font-size: 0.9375rem;
  color: var(--color-muted);
  line-height: 1.6;
  background: var(--color-paper);
  padding: 1.25rem;
  border-radius: 2px;
  border-left: 2px solid var(--color-accent);
  word-break: break-word;
}

.service-action {
  margin-top: 1rem;
}

.services-cta-box {
  margin-top: 5rem;
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: clamp(1.25rem, 5vw, 4rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .services-cta-box {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.services-cta-desc {
  margin-top: 1rem;
  font-size: 1.0625rem;
  color: var(--color-muted);
  line-height: 1.6;
}

.cta-quick-contacts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border-light);
}

.quick-contact-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.quick-contact-val {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
}

a.quick-contact-val:hover {
  color: var(--color-accent);
}

.text-accent {
  color: var(--color-accent);
}
</style>
