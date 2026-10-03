<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { projects } from '@/data/projects'
import { stats } from '@/data/stats'
import { partners } from '@/data/partners'
import { residents } from '@/data/residents'
import { testimonials } from '@/data/testimonials'

import SectionHeading from '@/components/SectionHeading.vue'
import StatCounter from '@/components/StatCounter.vue'
import ProjectShowcase from '@/components/ProjectShowcase.vue'
import LogoMarquee from '@/components/LogoMarquee.vue'
import LeadForm from '@/components/LeadForm.vue'
import { useReveal } from '@/composables/useReveal'

const { t } = useI18n()

// Rotating hero words (Biznes, Korxona, Kompaniya, Tashkilotlar)
const heroWordIndex = ref(0)
let heroTimer: ReturnType<typeof setInterval> | null = null

const heroWords = computed<string[]>(() => {
  const words = t('hero.words')
  if (Array.isArray(words)) return words
  return ['Biznes', 'Korxona', 'Kompaniya', 'Tashkilotlar']
})

onMounted(() => {
  heroTimer = setInterval(() => {
    heroWordIndex.value = (heroWordIndex.value + 1) % heroWords.value.length
  }, 2000)
})

onUnmounted(() => {
  if (heroTimer) clearInterval(heroTimer)
})

const featuredProjects = computed(() =>
  projects.filter((p) => p.featured).slice(0, 4),
)

// Active service item for expandable list-style services
const activeService = ref<number | null>(0)

const servicesList = computed(() => [
  {
    num: '01',
    title: t('services.website'),
    desc: t('services.websiteDesc'),
    tags: ['SPA / SSR', 'Vue / Nuxt', 'E-commerce', 'Highload'],
  },
  {
    num: '02',
    title: t('services.telegram'),
    desc: t('services.telegramDesc'),
    tags: ['Mini-apps (TWA)', 'Telegram Bot API', 'Payments Click / Payme'],
  },
  {
    num: '03',
    title: t('services.crm'),
    desc: t('services.crmDesc'),
    tags: ['AmoCRM / Bitrix24', 'Custom ERP', 'Avtomatlashtirish'],
  },
  {
    num: '04',
    title: t('services.mobile'),
    desc: t('services.mobileDesc'),
    tags: ['iOS & Android', 'Flutter', 'Cross-platform'],
  },
  {
    num: '05',
    title: t('services.custom'),
    desc: t('services.customDesc'),
    tags: ['Backend API', 'PostgreSQL / Redis', 'Cloud Infrastructure'],
  },
])

const processSteps = computed(() => [
  {
    step: '01',
    title: t('process.step1Title'),
    desc: t('process.step1Desc'),
  },
  {
    step: '02',
    title: t('process.step2Title'),
    desc: t('process.step2Desc'),
  },
  {
    step: '03',
    title: t('process.step3Title'),
    desc: t('process.step3Desc'),
  },
  {
    step: '04',
    title: t('process.step4Title'),
    desc: t('process.step4Desc'),
  },
  {
    step: '05',
    title: t('process.step5Title'),
    desc: t('process.step5Desc'),
  },
])

const whyUsPoints = computed(() => [
  {
    title: t('whyUs.contract'),
    desc: t('whyUs.contractDesc'),
  },
  {
    title: t('whyUs.local'),
    desc: t('whyUs.localDesc'),
  },
  {
    title: t('whyUs.ownership'),
    desc: t('whyUs.ownershipDesc'),
  },
  {
    title: t('whyUs.support'),
    desc: t('whyUs.supportDesc'),
  },
])

// Testimonials state
const currentTestimonialIndex = ref(0)
const activeTestimonial = computed(() => {
  return testimonials[currentTestimonialIndex.value] || testimonials[0] || null
})

function nextTestimonial() {
  currentTestimonialIndex.value =
    (currentTestimonialIndex.value + 1) % testimonials.length
}

function prevTestimonial() {
  currentTestimonialIndex.value =
    (currentTestimonialIndex.value - 1 + testimonials.length) % testimonials.length
}

const { el: statsRef } = useReveal(0.1)
</script>

<template>
  <div class="home-page">
    <!-- 1. HERO SECTION -->
    <section class="hero-section section-py">
      <div class="container">
        <div class="hero-header">
          <div class="hero-label-wrap">
            <span class="label hero-label">Samarqand, O‘zbekiston</span>
            <span class="hero-status-pill">
              <span class="hero-status-dot"></span>
              Yangi loyihalar uchun ochiqmiz
            </span>
          </div>

          <h1 class="display hero-title">
            <span class="hero-title__top">
              <span class="hero-word-slot">
                <Transition name="word-slide">
                  <span :key="heroWordIndex" class="hero-word-active text-accent">
                    {{ heroWords[heroWordIndex] }}
                  </span>
                </Transition>
              </span>
              <span class="hero-title__suffix">&nbsp;{{ t('hero.suffix') }}</span>
            </span>
            <br />
            <span class="hero-title__bottom">{{ t('hero.systems') }}</span>
          </h1>

          <div class="hero-bottom-row">
            <p class="hero-subtitle">
              {{ t('hero.sub') }}
            </p>
            <div class="hero-actions">
              <a href="#contact" class="btn btn--accent">
                {{ t('cta.request') }}
              </a>
              <RouterLink to="/projects" class="btn btn--outline">
                {{ t('cta.viewAll') }}
              </RouterLink>
            </div>
          </div>
        </div>

        <!-- Featured Projects strip visible right at / below fold -->
        <div class="hero-strip">
          <div class="hero-strip__header">
            <span class="label hero-strip__label">So‘nggi ishlar</span>
            <RouterLink to="/projects" class="hero-strip__link">
              {{ t('cta.viewAll') }} →
            </RouterLink>
          </div>
          <div class="hero-strip__grid">
            <RouterLink
              v-for="proj in featuredProjects.slice(0, 3)"
              :key="proj.slug"
              :to="`/projects/${proj.slug}`"
              class="hero-strip__card"
            >
              <div class="hero-strip__media">
                <img
                  v-if="proj.coverImage"
                  :src="proj.coverImage"
                  :alt="proj.title"
                  class="hero-strip__img"
                />
                <div v-else class="project-placeholder">
                  <span v-if="proj.placeholder" class="placeholder-badge">Placeholder</span>
                  <div class="hero-strip__placeholder-content">
                    <span class="label text-accent">{{ proj.client }}</span>
                    <h3 class="h3 text-white">{{ proj.title }}</h3>
                  </div>
                </div>
              </div>
              <div class="hero-strip__info">
                <span class="hero-strip__industry">{{ proj.industry }}</span>
                <span class="hero-strip__title">{{ proj.title }}</span>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. STATS BAND -->
    <section ref="statsRef" class="stats-band">
      <div class="container">
        <div class="grid-12">
          <div
            v-for="stat in stats"
            :key="stat.id"
            class="stat-col col-span-6 md:col-span-3"
          >
            <StatCounter
              :value="stat.value"
              :suffix="stat.suffix"
              :label="t(stat.labelKey)"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FEATURED PROJECTS (Alternating showcases) -->
    <section class="section-py section-projects">
      <div class="container">
        <div class="projects-section-header">
          <SectionHeading
            label="01 / PORTFOLIO"
            :title="t('projects.title')"
            :subtitle="t('projects.subtitle')"
          />
          <RouterLink to="/projects" class="btn btn--outline view-all-btn">
            {{ t('cta.viewAll') }}
          </RouterLink>
        </div>

        <div class="project-showcases-list">
          <ProjectShowcase
            v-for="(proj, idx) in featuredProjects"
            :key="proj.slug"
            :project="proj"
            :reversed="idx % 2 === 1"
          />
        </div>
      </div>
    </section>

    <!-- 4. SERVICES (Architectural 01-05 List) -->
    <section class="section-py section-dark">
      <div class="container">
        <SectionHeading
          label="02 / XIZMATLAR"
          :title="t('services.title')"
          :subtitle="t('services.subtitle')"
          dark
        />

        <div class="services-list">
          <div
            v-for="(s, index) in servicesList"
            :key="s.num"
            class="service-item"
            :class="{ 'service-item--active': activeService === index }"
            @click="activeService = activeService === index ? null : index"
          >
            <div class="service-item__header">
              <span class="service-item__num">{{ s.num }}</span>
              <h3 class="h3 service-item__title">{{ s.title }}</h3>
              <span class="service-item__toggle" aria-hidden="true">
                {{ activeService === index ? '—' : '+' }}
              </span>
            </div>

            <div v-show="activeService === index" class="service-item__content">
              <p class="service-item__desc">{{ s.desc }}</p>
              <div class="service-item__tags">
                <span v-for="tag in s.tags" :key="tag" class="tag-pill">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="services-cta-row">
          <RouterLink to="/services" class="btn btn--outline">
            Barcha xizmatlar bilan tanishish →
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 5. PROCESS TIMELINE -->
    <section class="section-py">
      <div class="container">
        <SectionHeading
          label="03 / BOSQICHLAR"
          :title="t('process.title')"
          subtitle="Shartnoma tuzishdan to to‘liq ishga tushirishgacha bo‘lgan shaffof yo‘l."
        />

        <div class="process-grid">
          <div
            v-for="item in processSteps"
            :key="item.step"
            class="process-step-card"
          >
            <span class="process-step-num">{{ item.step }}</span>
            <h4 class="h3 process-step-title">{{ item.title }}</h4>
            <p class="process-step-desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. WHY US (Value Proposition) -->
    <section class="section-py section-why-us">
      <div class="container">
        <div class="why-us-layout">
          <div class="why-us-intro">
            <SectionHeading
              label="04 / ISHONCH"
              :title="t('whyUs.title')"
              subtitle="Biznesingiz uchun barqaror va xavfsiz texnologik hamkorlik."
            />
          </div>

          <div class="why-us-points">
            <div
              v-for="(point, idx) in whyUsPoints"
              :key="idx"
              class="why-us-card"
            >
              <span class="why-us-index">0{{ idx + 1 }}</span>
              <h4 class="why-us-title">{{ point.title }}</h4>
              <p class="why-us-desc">{{ point.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. PARTNERS & RESIDENTS -->
    <section class="section-py section-dark section-partners">
      <div class="container">
        <SectionHeading
          label="05 / EKOTIZIM"
          :title="t('partners.title')"
          subtitle="O‘zbekiston va mintaqadagi yetakchi kompaniyalar bizga ishonadi."
          dark
        />

        <!-- Marquee -->
        <div class="partners-marquee-wrapper">
          <LogoMarquee :speed="30">
            <component
              :is="partner.url ? 'a' : 'div'"
              v-for="partner in partners"
              :key="partner.id"
              :href="partner.url || undefined"
              :target="partner.url ? '_blank' : undefined"
              :rel="partner.url ? 'noopener noreferrer' : undefined"
              class="partner-logo-item"
              :class="{ 'partner-logo-item--link': !!partner.url }"
            >
              <img
                v-if="partner.logoUrl"
                :src="partner.logoUrl"
                :alt="partner.name"
                class="partner-logo-img"
              />
              <span class="partner-name">{{ partner.name }}</span>
              <span v-if="!partner.placeholder" class="partner-badge-verified">Hamkor</span>
            </component>
          </LogoMarquee>
        </div>

        <!-- Residents block (Only show when data exists) -->
        <div v-if="residents.length" class="residents-block">
          <div class="residents-card">
            <div class="residents-card__header">
              <span class="label text-accent">{{ t('partners.residents') }}</span>
              <span class="tag-pill">Rasmiy</span>
            </div>
            <div v-for="res in residents" :key="res.id" class="residents-detail">
              <h4 class="h3 text-white">{{ res.name }}</h4>
              <p class="residents-desc">{{ res.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. TESTIMONIALS (Large rotating quote) -->
    <section v-if="testimonials.length" class="section-py section-testimonials">
      <div class="container">
        <SectionHeading
          label="06 / FIKRLAR"
          :title="t('testimonials.title')"
        />

        <div v-if="activeTestimonial" class="testimonial-box">
          <blockquote class="testimonial-quote">
            {{ activeTestimonial.quote }}
          </blockquote>

          <div class="testimonial-footer">
            <div class="testimonial-author">
              <div class="testimonial-author-name">
                {{ activeTestimonial.personName }}
              </div>
              <div class="testimonial-author-role">
                {{ activeTestimonial.personRole }}, {{ activeTestimonial.company }}
              </div>
            </div>

            <div class="testimonial-controls">
              <button
                class="testimonial-nav-btn"
                aria-label="Oldingi fikr"
                @click="prevTestimonial"
              >
                ←
              </button>
              <span class="testimonial-counter">
                {{ currentTestimonialIndex + 1 }} / {{ testimonials.length }}
              </span>
              <button
                class="testimonial-nav-btn"
                aria-label="Keyingi fikr"
                @click="nextTestimonial"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 9. FINAL CTA + CONTACT FORM -->
    <section id="contact" class="section-py section-cta">
      <div class="container">
        <div class="cta-layout">
          <div class="cta-intro">
            <span class="label text-accent">Loyihani boshlash</span>
            <h2 class="display cta-title">
              Keling, birga quramiz.
            </h2>
            <p class="cta-desc">
              Goyangiz bormi yoki biznes jarayonlarini avtomatlashtirish kerakmi? Ariza qoldiring, 1 ish kuni ichida loyiha rejasi va smetasini taqdim etamiz.
            </p>

            <div class="cta-quick-contacts">
              <div class="quick-contact-item">
                <span class="label">Telefon</span>
                <a href="tel:+998000000000" class="quick-contact-val">+998 00 000 00 00</a>
              </div>
              <div class="quick-contact-item">
                <span class="label">Telegram</span>
                <a href="https://t.me/gmetechnologies" target="_blank" class="quick-contact-val">@gmetechnologies</a>
              </div>
              <div class="quick-contact-item">
                <span class="label">Manzil</span>
                <span class="quick-contact-val">Samarqand sh., Universitet xiyoboni</span>
              </div>
            </div>
          </div>

          <div class="cta-form-card">
            <div class="cta-form-header">
              <h3 class="h3">{{ t('form.title') }}</h3>
              <p class="cta-form-sub">{{ t('form.subtitle') }}</p>
            </div>
            <LeadForm />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ─── Hero ─────────────────────────────────────────────────────────────── */
.hero-section {
  padding-top: clamp(2rem, 5vw, 4rem);
  padding-bottom: clamp(3rem, 6vw, 5rem);
}

.hero-label-wrap {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.hero-label {
  color: var(--color-accent);
}

.hero-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-ink);
  background: rgba(11, 15, 20, 0.05);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--color-border-light);
}

.hero-status-dot {
  width: 6px;
  height: 6px;
  background-color: #10b981;
  border-radius: 50%;
  box-shadow: 0 0 6px #10b981;
}

.hero-title {
  color: var(--color-ink);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: clamp(2.5rem, 11vw, 3.5rem);
    line-height: 1.08;
  }
}

.hero-title__top {
  display: inline-flex;
  align-items: baseline;
  vertical-align: bottom;
  white-space: nowrap;
}

.hero-word-slot {
  display: inline-flex;
  position: relative;
  overflow: hidden;
  vertical-align: baseline;
  padding-top: 0.12em;
  margin-top: -0.12em;
  padding-bottom: 0.25em;
  margin-bottom: -0.25em;
  padding-right: 0.06em;
}

.hero-word-active {
  display: inline-block;
  white-space: nowrap;
  color: var(--color-accent);
  line-height: 1.15;
}

.hero-title__suffix {
  display: inline-block;
  color: var(--color-ink);
}

.hero-title__bottom {
  display: block;
}

/* ─── Right-to-Left Ticker Transition ─── */
.word-slide-enter-active,
.word-slide-leave-active {
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.4s ease;
}

.word-slide-enter-from {
  transform: translateX(110%);
  opacity: 0;
}

.word-slide-enter-to {
  transform: translateX(0%);
  opacity: 1;
}

.word-slide-leave-from {
  transform: translateX(0%);
  opacity: 1;
}

.word-slide-leave-to {
  transform: translateX(-110%);
  opacity: 0;
}

.word-slide-leave-active {
  position: absolute;
  top: 0.12em;
  left: 0;
}

@media (prefers-reduced-motion: reduce) {
  .word-slide-enter-active,
  .word-slide-leave-active {
    transition: opacity 0.2s ease;
    transform: none !important;
  }
}

.hero-bottom-row {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2.5rem;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .hero-bottom-row {
    flex-direction: row;
    align-items: flex-end;
  }
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.5;
  color: var(--color-muted);
  max-width: 44ch;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ─── Hero strip ────────────────────────────────────────────────────────── */
.hero-strip {
  margin-top: clamp(3.5rem, 7vw, 6rem);
  border-top: 1px solid var(--color-border-light);
  padding-top: 2rem;
}

.hero-strip__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.hero-strip__label {
  color: var(--color-accent);
}

.hero-strip__link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
}

.hero-strip__link:hover {
  color: var(--color-accent);
}

.hero-strip__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .hero-strip__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.hero-strip__card {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.hero-strip__media {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 2px;
  background-color: var(--color-ink);
}

.hero-strip__placeholder-content {
  margin-top: auto;
}

.hero-strip__info {
  display: flex;
  flex-direction: column;
}

.hero-strip__industry {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-accent);
  letter-spacing: 0.05em;
}

.hero-strip__title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.3;
}

/* ─── Stats band ────────────────────────────────────────────────────────── */
.stats-band {
  background-color: var(--color-ink);
  color: var(--color-paper);
  padding-block: clamp(3rem, 6vw, 4.5rem);
}

.stat-col {
  grid-column: span 6;
}

@media (min-width: 768px) {
  .stat-col {
    grid-column: span 3;
  }
}

/* ─── Projects section ─────────────────────────────────────────────────── */
.projects-section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
}

.view-all-btn {
  display: none;
}

@media (min-width: 768px) {
  .view-all-btn {
    display: inline-flex;
  }
}

/* ─── Services list (01-05) ────────────────────────────────────────────── */
.services-list {
  display: flex;
  flex-direction: column;
  margin-top: 3rem;
  border-top: 1px solid var(--color-border);
}

.service-item {
  border-bottom: 1px solid var(--color-border);
  padding-block: 2rem;
  cursor: pointer;
  transition: background-color var(--duration) var(--ease-out);
}

.service-item:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

.service-item__header {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 3vw, 2.5rem);
}

.service-item__num {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: monospace;
  color: var(--color-accent);
}

.service-item__title {
  color: var(--color-paper);
  flex-grow: 1;
}

.service-item__toggle {
  font-size: 1.5rem;
  color: rgba(244, 242, 238, 0.4);
  font-weight: 300;
}

.service-item__content {
  padding-top: 1.5rem;
  padding-left: clamp(2rem, 5vw, 4rem);
}

.service-item__desc {
  font-size: 1.0625rem;
  color: rgba(244, 242, 238, 0.7);
  max-width: 52ch;
  line-height: 1.6;
}

.service-item__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.25rem;
}

.services-cta-row {
  margin-top: 3.5rem;
}

/* ─── Process Grid ─────────────────────────────────────────────────────── */
.process-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  border-top: 1px solid var(--color-border-light);
  padding-top: 3rem;
}

@media (min-width: 640px) {
  .process-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .process-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.process-step-card {
  display: flex;
  flex-direction: column;
  position: relative;
}

.process-step-num {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-accent);
  line-height: 1;
}

.process-step-title {
  margin-top: 1.25rem;
  font-size: 1.25rem;
  color: var(--color-ink);
}

.process-step-desc {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.5;
}

/* ─── Why Us ───────────────────────────────────────────────────────────── */
.section-why-us {
  background-color: #eeebe5;
}

.why-us-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3.5rem;
}

@media (min-width: 1024px) {
  .why-us-layout {
    grid-template-columns: 5fr 7fr;
  }
}

.why-us-points {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .why-us-points {
    grid-template-columns: repeat(2, 1fr);
  }
}

.why-us-card {
  background: var(--color-paper);
  padding: 2rem;
  border-radius: 2px;
  border: 1px solid var(--color-border-light);
}

.why-us-index {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 1rem;
  display: block;
}

.why-us-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink);
  line-height: 1.3;
}

.why-us-desc {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.6;
}

/* ─── Partners & Residents ─────────────────────────────────────────────── */
.partners-marquee-wrapper {
  margin-block: 2rem 4rem;
  padding-block: 2rem;
  border-block: 1px solid var(--color-border);
}

.partner-logo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  text-decoration: none;
  transition: all var(--duration) var(--ease-out);
  position: relative;
}

.partner-logo-item--link:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-accent);
  box-shadow: 0 6px 16px rgba(255, 90, 31, 0.2);
  transform: translateY(-3px);
  z-index: 2;
}

.partner-logo-img {
  width: 30px;
  height: 30px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.partner-name {
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: rgba(244, 242, 238, 0.85);
  white-space: nowrap;
}

.partner-badge-verified {
  font-size: 0.625rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.15rem 0.4rem;
  background: rgba(255, 90, 31, 0.2);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  border-radius: 2px;
  margin-left: 0.25rem;
}

.residents-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  padding: 2.5rem;
  border-radius: 2px;
}

.residents-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.residents-desc {
  margin-top: 0.75rem;
  color: rgba(244, 242, 238, 0.6);
  font-size: 0.9375rem;
}

/* ─── Testimonials ─────────────────────────────────────────────────────── */
.testimonial-box {
  background: #ffffff;
  padding: clamp(2rem, 5vw, 4.5rem);
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
}

.testimonial-quote {
  font-size: clamp(1.25rem, 2.5vw, 2rem);
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  max-width: 38ch;
}

.testimonial-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border-light);
  justify-content: space-between;
}

@media (min-width: 640px) {
  .testimonial-footer {
    flex-direction: row;
    align-items: center;
  }
}

.testimonial-author-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink);
}

.testimonial-author-role {
  font-size: 0.875rem;
  color: var(--color-muted);
}

.testimonial-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-nav-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border-light);
  background: var(--color-paper);
  border-radius: 2px;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--color-ink);
  transition: all var(--duration) var(--ease-out);
}

.testimonial-nav-btn:hover {
  background: var(--color-ink);
  color: var(--color-paper);
}

.testimonial-counter {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-muted);
}

/* ─── Final CTA ────────────────────────────────────────────────────────── */
.section-cta {
  background-color: var(--color-paper);
  border-top: 1px solid var(--color-border-light);
}

.cta-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(3rem, 6vw, 6rem);
}

@media (min-width: 1024px) {
  .cta-layout {
    grid-template-columns: 6fr 6fr;
    align-items: start;
  }
}

.cta-title {
  color: var(--color-ink);
  margin-top: 1rem;
  line-height: 1;
}

.cta-desc {
  margin-top: 1.5rem;
  font-size: 1.125rem;
  color: var(--color-muted);
  line-height: 1.6;
  max-width: 42ch;
}

.cta-quick-contacts {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 3rem;
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

.cta-form-card {
  background: #ffffff;
  padding: clamp(2rem, 4vw, 3rem);
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  box-shadow: 0 10px 30px rgba(11, 15, 20, 0.04);
}

.cta-form-header {
  margin-bottom: 2rem;
}

.cta-form-sub {
  margin-top: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-muted);
}

.text-accent {
  color: var(--color-accent);
}

.text-white {
  color: #ffffff;
}
</style>
