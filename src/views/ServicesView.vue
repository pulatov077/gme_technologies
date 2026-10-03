<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionHeading from '@/components/SectionHeading.vue'
import LeadForm from '@/components/LeadForm.vue'

const { t } = useI18n()

const detailedServices = [
  {
    id: 'websites',
    num: '01',
    titleKey: 'services.website',
    descKey: 'services.websiteDesc',
    included: [
      'Moslashuvchan dizayn (Mobile, Tablet, Desktop)',
      'Tezkor yuklanish (Core Web Vitals 95+)',
      'SEO va Open Graph tayyorgarligi',
      'Ma’muriyat paneli (CMS) yoki boshqaruv tizimi',
      'Xavfsizlik va SSL sertifikati',
    ],
    process: 'Analitika → Wireframe → UI/UX → Frontend & Backend → QA & Test → Deploy',
  },
  {
    id: 'telegram',
    num: '02',
    titleKey: 'services.telegram',
    descKey: 'services.telegramDesc',
    included: [
      'Telegram Web Apps (TWA) mini-ilovalar',
      'Click va Payme orqali to‘lov tizimlari integratsiyasi',
      'Mijozlar bilan avtomatik muloqot va AI yordamchi',
      'Ombor va CRM bilan ikki tomonlama sinxronizatsiya',
      'Tezkor xabar yuborish va reklama vositalari',
    ],
    process: 'Logika xaritasi → Bot arxitekturasi → Mini-app interfeysi → To‘lov sinovi → Ishga tushirish',
  },
  {
    id: 'crm',
    num: '03',
    titleKey: 'services.crm',
    descKey: 'services.crmDesc',
    included: [
      'Savdo voronkasi va mijozlar bazasi boshqaruvi',
      'IP-telefoniya va SMS-xabarnomalar integratsiyasi',
      'Xodimlar KPI va hisobotlar avtomatizatsiyasi',
      '1C, bank hisoblari va yetkazib berish xizmatlari bilan ulanish',
      'Rol va kirish huquqlarini cheklash',
    ],
    process: 'Biznes-audit → Texnik topshiriq (TOR) → Tizimni sozlash/ishlab chiqish → Xodimlarni o‘qitish',
  },
  {
    id: 'mobile',
    num: '04',
    titleKey: 'services.mobile',
    descKey: 'services.mobileDesc',
    included: [
      'iOS (App Store) va Android (Google Play) uchun ilovalar',
      'Push-xabarnomalar va geolokatsiya xizmatlari',
      'Offline rejimida ishlash imkoniyati',
      'Biometrik autentifikatsiya (FaceID, Fingerprint)',
      'Analitika va foydalanuvchilar harakati monitoringi',
    ],
    process: 'Prototip → UI dizayn → Native/Flutter dasturlash → Backend integratsiya → Do‘konlarga nashr qilish',
  },
  {
    id: 'custom',
    num: '05',
    titleKey: 'services.custom',
    descKey: 'services.customDesc',
    included: [
      'Yuqori yuklamali arxitektura va mikroxizmatlar',
      'Maxsus algoritmlar va ma’lumotlar bazasi optimizatsiyasi',
      'Rest API va GraphQL shlyuzlari',
      'Avtomatlashtirilgan CI/CD va bulutli infratuzilma',
      'Loyiha kodiga to‘liq egalik huquqi',
    ],
    process: 'Arxitektura loyihalash → Sprint-asosli dasturlash → Load testing → Monitoring o‘rnatish',
  },
]
</script>

<template>
  <div class="services-page section-py">
    <div class="container">
      <SectionHeading
        label="XIZMATLAR"
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
              <h3 class="label text-accent">Nimalar kiritilgan</h3>
              <ul class="detail-list">
                <li v-for="(item, i) in serv.included" :key="i">
                  <span class="check-icon">✓</span>
                  <span>{{ item }}</span>
                </li>
              </ul>
            </div>

            <!-- Typical process -->
            <div class="detail-box">
              <h3 class="label text-accent">Amalga oshirish jarayoni</h3>
              <p class="process-flow">{{ serv.process }}</p>
              <div class="service-action">
                <a href="#request-service" class="btn btn--outline btn--sm">
                  Buyurtma berish
                </a>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Service Request CTA -->
      <div id="request-service" class="services-cta-box">
        <div class="services-cta-info">
          <span class="label text-accent">HAMKORLIK</span>
          <h2 class="h2">Qaysi xizmat sizning biznesingizga to‘g‘ri keladi?</h2>
          <p class="services-cta-desc">
            Vazifangizni yozib qoldiring, mutaxassislarimiz tahlil qilib, optimal texnik yechim taklif qilishadi.
          </p>
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
  padding: clamp(2rem, 5vw, 3.5rem);
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
}

.service-action {
  margin-top: 1rem;
}

.services-cta-box {
  margin-top: 5rem;
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: clamp(2rem, 5vw, 4rem);
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

.text-accent {
  color: var(--color-accent);
}
</style>
