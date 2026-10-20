<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { team } from '@/data/team'
import { partners } from '@/data/partners'
import { residents } from '@/data/residents'
import SectionHeading from '@/components/SectionHeading.vue'
import LogoMarquee from '@/components/LogoMarquee.vue'

const { t, locale } = useI18n()

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.charAt(0) || ''
  const second = parts[1]?.charAt(0) || ''
  return (first + second).toUpperCase() || 'G'
}

/* Event Gallery Slider */
const eventPhotos = [
  { id: 1, src: '/images/gme-presentation-2025.jpg', alt: 'GME Technologies — AI Hackathon Presentation', placeholder: false },
  { id: 2, src: '/images/events/ai-hackathon-stage.jpg', alt: 'National AI Hackathon: Samarkand — Katta sahna va jamoa', placeholder: false },
  { id: 4, src: '/images/events/ai-hackathon-group.jpg', alt: 'National AI Hackathon: Samarkand — Ishtirokchilar va jamoa', placeholder: false },
]

const activePhotoIndex = ref(0)
let galleryTimer: ReturnType<typeof setInterval> | null = null
let resumeTimeout: ReturnType<typeof setTimeout> | null = null
let touchStartX = 0

const nextPhoto = () => {
  activePhotoIndex.value = (activePhotoIndex.value + 1) % eventPhotos.length
}

const prevPhoto = () => {
  activePhotoIndex.value =
    (activePhotoIndex.value - 1 + eventPhotos.length) % eventPhotos.length
}

const startAutoScroll = () => {
  if (galleryTimer) clearInterval(galleryTimer)
  galleryTimer = setInterval(nextPhoto, 3000)
}

const stopAutoScroll = () => {
  if (galleryTimer) {
    clearInterval(galleryTimer)
    galleryTimer = null
  }
}

const resetTimerAfterInteraction = () => {
  stopAutoScroll()
  if (resumeTimeout) clearTimeout(resumeTimeout)
  resumeTimeout = setTimeout(() => {
    startAutoScroll()
  }, 3000)
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaY > 0 || e.deltaX > 0) {
    nextPhoto()
  } else if (e.deltaY < 0 || e.deltaX < 0) {
    prevPhoto()
  }
  resetTimerAfterInteraction()
}

const handleTouchStart = (e: TouchEvent) => {
  if (e.touches[0]) {
    touchStartX = e.touches[0].clientX
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  if (e.changedTouches[0]) {
    const diff = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(diff) > 30) {
      if (diff < 0) nextPhoto()
      else prevPhoto()
      resetTimerAfterInteraction()
    }
  }
}

onMounted(() => {
  startAutoScroll()
})

onUnmounted(() => {
  stopAutoScroll()
  if (resumeTimeout) clearTimeout(resumeTimeout)
})

const currentLocale = computed<'uz' | 'ru' | 'en'>(() => {
  return (locale.value === 'ru' || locale.value === 'en') ? locale.value : 'uz'
})

const valuesData = {
  uz: [
    {
      num: '01',
      title: 'Haqiqiy natijadorlik',
      desc: 'Biz faqat chiroyli kod emas, biznes uchun aniq daromad va samaradorlik keltiradigan raqamli tizimlar quramiz.',
    },
    {
      num: '02',
      title: 'To‘liq shaffoflik',
      desc: 'Loyiha jarayonida yashirin to‘lovlar yo‘q. Hamma bosqichlar Git omborida va vazifalar taxtasida ko‘rinib turadi.',
    },
    {
      num: '03',
      title: 'Kod va ma’lumotlar mulki',
      desc: 'Loyiha yakunida butun manba kodi, ma’lumotlar bazasi va barcha server hisoblari buyurtmachi ixtiyoriga to‘liq topshiriladi.',
    },
    {
      num: '04',
      title: 'Doimiy hamkorlik',
      desc: 'Sayt yoki ilova ishga tushirilgandan keyin mijozni yolg‘iz qoldirmaymiz. Texnik qo‘llab-quvvatlash va rivojlantirishda yordam beramiz.',
    },
  ],
  ru: [
    {
      num: '01',
      title: 'Измеримый результат',
      desc: 'Мы создаем не просто красивый код, а надежные цифровые системы, приносящие прибыль и эффективность бизнесу.',
    },
    {
      num: '02',
      title: 'Полная прозрачность',
      desc: 'Никаких скрытых платежей. Все этапы видны в Git-репозитории и трекере задач.',
    },
    {
      num: '03',
      title: 'Собственность на код и данные',
      desc: 'По завершении проекта весь исходный код, базы данных и доступы к серверам передаются заказчику.',
    },
    {
      num: '04',
      title: 'Долгосрочная поддержка',
      desc: 'После запуска мы не оставляем клиента одного, обеспечивая техническое сопровождение и развитие.',
    },
  ],
  en: [
    {
      num: '01',
      title: 'Measurable Results',
      desc: 'We build digital systems that generate real business revenue and operational efficiency, not just pretty code.',
    },
    {
      num: '02',
      title: 'Complete Transparency',
      desc: 'Zero hidden fees. Every sprint and commit is visible in Git repositories and task boards.',
    },
    {
      num: '03',
      title: 'Code & Data Ownership',
      desc: 'Full source code, databases, and cloud infrastructure credentials belong 100% to the client.',
    },
    {
      num: '04',
      title: 'Long-Term Partnership',
      desc: 'We do not walk away after launch; our team remains available for post-launch maintenance and feature growth.',
    },
  ],
}

const values = computed(() => {
  return valuesData[currentLocale.value] || valuesData.uz
})
</script>

<template>
  <div class="about-page section-py">
    <div class="container">
      <!-- About Intro & Story -->
      <div class="about-intro">
        <SectionHeading
          :label="t('aboutPage.label')"
          :title="t('about.title')"
          :subtitle="t('about.subtitle')"
        />

        <div class="about-story-content">
          <p class="about-story-text">{{ t('about.storyText1') }}</p>
          <p class="about-story-text">{{ t('about.storyText2') }}</p>
        </div>
      </div>

      <!-- Team -->
      <div class="team-section">
        <div class="team-header">
          <div>
            <span class="label text-accent">{{ t('aboutPage.teamLabel') }}</span>
            <h2 class="h2">{{ t('about.team') }}</h2>
          </div>
          <p class="team-sub">
            {{ t('about.teamSub') }}
          </p>
        </div>

        <div class="team-grid">
          <div v-for="member in team" :key="member.id" class="team-card">
            <div class="team-photo-placeholder">
              <img
                v-if="member.photoUrl"
                :src="member.photoUrl"
                :alt="member.name"
                class="team-photo"
              />
              <div v-else class="team-avatar-box">
                <span class="team-initials">{{ getInitials(member.name) }}</span>
              </div>
            </div>
            <div class="team-info">
              <h3 class="team-name">{{ member.name }}</h3>
              <p class="team-role">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Section -->
      <div class="presentation-section">
        <div class="presentation-layout">
          <!-- Text Info Left Side -->
          <div class="presentation-info-side">
            <span class="label text-accent">{{ t('about.eventsLabel') }}</span>
            <h2 class="h2 story-title">{{ t('about.eventTitle') }}</h2>
            <div class="presentation-texts">
              <p class="presentation-desc">
                {{ t('about.eventDesc1') }}
              </p>
              <p class="presentation-desc">
                {{ t('about.eventDesc2') }}
              </p>
            </div>
            <div class="presentation-tags">
              <span class="presentation-tag">🤖 AI Hackathon</span>
              <span class="presentation-tag">📍 Movenpick, Samarqand</span>
              <span class="presentation-tag">📅 Yanvar 2026</span>
            </div>
          </div>

          <!-- Compact Interactive Slider Right Side -->
          <div class="presentation-slider-side">
            <div
              class="event-slider"
              @wheel.prevent="handleWheel"
              @touchstart="handleTouchStart"
              @touchend="handleTouchEnd"
              @mouseenter="stopAutoScroll"
              @mouseleave="resetTimerAfterInteraction"
            >
              <div
                class="slider-track"
                :style="{ transform: `translateX(-${activePhotoIndex * 100}%)` }"
              >
                <div
                  v-for="photo in eventPhotos"
                  :key="photo.id"
                  class="slider-slide"
                >
                  <img
                    v-if="!photo.placeholder"
                    :src="photo.src"
                    :alt="photo.alt"
                    class="slider-img"
                  />
                  <div v-else class="slider-placeholder">
                    <span class="placeholder-icon">📷</span>
                    <span class="placeholder-label">{{ photo.alt }}</span>
                  </div>
                </div>
              </div>

              <!-- Gradient overlay -->
              <div class="slider-overlay"></div>

              <!-- Navigation arrows -->
              <button
                class="slider-nav slider-nav--prev"
                aria-label="Oldingi rasm"
                @click.stop="prevPhoto(); resetTimerAfterInteraction()"
              >
                ‹
              </button>
              <button
                class="slider-nav slider-nav--next"
                aria-label="Keyingi rasm"
                @click.stop="nextPhoto(); resetTimerAfterInteraction()"
              >
                ›
              </button>

              <!-- Indicators & counter -->
              <div class="slider-footer">
                <div class="slider-dots">
                  <button
                    v-for="(_, idx) in eventPhotos"
                    :key="'dot-' + idx"
                    class="slider-dot"
                    :class="{ 'slider-dot--active': idx === activePhotoIndex }"
                    :aria-label="`Rasm ${idx + 1}`"
                    @click.stop="activePhotoIndex = idx; resetTimerAfterInteraction()"
                  />
                </div>
                <div class="slider-counter">
                  {{ activePhotoIndex + 1 }} / {{ eventPhotos.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Values -->
      <div class="values-section">
        <span class="label text-accent">{{ t('aboutPage.valuesLabel') }}</span>
        <h2 class="h2 values-heading">{{ t('about.valuesTitle') }}</h2>

        <div class="values-grid">
          <div v-for="val in values" :key="val.num" class="value-card">
            <span class="value-num">{{ val.num }}</span>
            <h3 class="h3 value-title">{{ val.title }}</h3>
            <p class="value-desc">{{ val.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Office in Samarkand -->
      <div class="office-section">
        <div class="office-box">
          <div class="office-info">
            <span class="label text-accent">{{ t('about.locationLabel') }}</span>
            <h2 class="h2">{{ t('about.locationTitle') }}</h2>
            <p class="office-desc">
              {{ t('about.locationDesc') }}
            </p>
            <div class="office-address">
              <p><strong>{{ t('about.addressLabel') }}</strong> {{ t('about.addressVal') }}</p>
              <p><strong>{{ t('about.workHoursLabel') }}</strong> {{ t('about.workHoursVal') }}</p>
              <p><strong>{{ t('about.phoneLabel') }}</strong> <a href="tel:+998913131154" class="text-accent hover:underline">+998 91 313 11 54</a></p>
            </div>
          </div>
          <div class="office-map-container">
            <iframe
              src="https://maps.google.com/maps?q=39.6743375,66.9735469&hl=uz&z=16&output=embed"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen="false"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="GME Technologies bosh ofisi"
              class="office-map-iframe"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Partners marquee -->
      <div v-if="partners.length" class="about-partners">
        <span class="label text-accent">{{ t('servicesPage.collabTag') }}</span>
        <h2 class="h2 partners-title">{{ t('partners.title') }}</h2>
        <LogoMarquee :speed="25">
          <component
            :is="p.url ? 'a' : 'div'"
            v-for="p in partners"
            :key="p.id"
            :href="p.url || undefined"
            :target="p.url ? '_blank' : undefined"
            :rel="p.url ? 'noopener noreferrer' : undefined"
            class="partner-pill"
            :class="{ 'partner-pill--link': !!p.url }"
          >
            <img
              v-if="p.logoUrl"
              :src="p.logoUrl"
              :alt="p.name"
              class="partner-pill-img"
            />
            <span>{{ p.name }}</span>
          </component>
        </LogoMarquee>
      </div>

      <!-- Residents -->
      <div v-if="residents.length" class="about-residents">
        <div class="residents-box">
          <span class="label text-accent">{{ t('partners.residents') }}</span>
          <div v-for="r in residents" :key="r.id" class="resident-item">
            <h3 class="h3">{{ r.name }}</h3>
            <p>{{ r.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-intro {
  padding-bottom: 3.5rem;
  border-bottom: 1px solid var(--color-border-light);
}

.about-intro :deep(.section-heading) {
  margin-bottom: 1.5rem;
}

.about-story-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 76ch;
}

.about-story-text {
  font-size: 1.125rem;
  line-height: 1.75;
  color: var(--color-muted);
}

/* Event Section & Compact Slider */
.presentation-section {
  padding-block: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.presentation-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}

@media (min-width: 992px) {
  .presentation-layout {
    grid-template-columns: 1.1fr 1fr;
    gap: 3.5rem;
  }
}

.presentation-info-side {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.presentation-texts {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.presentation-desc {
  font-size: 1.0625rem;
  line-height: 1.65;
  color: var(--color-muted);
}

.presentation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.presentation-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  background: rgba(255, 90, 31, 0.08);
  border: 1px solid rgba(255, 90, 31, 0.2);
  border-radius: 100px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-ink);
}

/* Compact Slider Side */
.presentation-slider-side {
  display: flex;
  justify-content: center;
}

.event-slider {
  position: relative;
  width: 100%;
  max-width: 580px;
  height: 290px;
  border-radius: 8px;
  overflow: hidden;
  background: #111820;
  box-shadow: 0 12px 36px rgba(11, 15, 20, 0.12);
  border: 1px solid var(--color-border-light);
  cursor: grab;
  user-select: none;
}

.event-slider:active {
  cursor: grabbing;
}

.slider-track {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.9s cubic-bezier(0.25, 1, 0.5, 1);
  will-change: transform;
}

.slider-slide {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.slider-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.event-slider:hover .slider-img {
  transform: scale(1.06);
}

.slider-placeholder {
  width: 100%;
  height: 100%;
  background: #111820;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: rgba(244, 242, 238, 0.4);
}

.placeholder-icon {
  font-size: 2.25rem;
  opacity: 0.4;
}

.placeholder-label {
  font-size: 0.875rem;
  color: rgba(244, 242, 238, 0.45);
  font-weight: 500;
}

.slider-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(11, 15, 20, 0.5) 0%,
    transparent 40%
  );
  pointer-events: none;
  z-index: 1;
}

/* Nav arrows */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(11, 15, 20, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 3;
  font-size: 1.25rem;
  line-height: 1;
  opacity: 0;
  transition: all 0.25s ease;
}

.event-slider:hover .slider-nav {
  opacity: 1;
}

.slider-nav:hover {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

@media (hover: none), (max-width: 768px) {
  .slider-nav {
    opacity: 0.85;
  }
}

.slider-nav--prev {
  left: 12px;
}

.slider-nav--next {
  right: 12px;
}

/* Footer indicators & counter */
.slider-footer {
  position: absolute;
  bottom: 12px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 2;
  pointer-events: none;
}

.slider-dots {
  display: flex;
  gap: 6px;
  pointer-events: auto;
}

.slider-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  border: none;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dot--active {
  width: 22px;
  border-radius: 100px;
  background: var(--color-accent);
}

.slider-counter {
  background: rgba(11, 15, 20, 0.65);
  backdrop-filter: blur(4px);
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  font-family: monospace;
}

@media (max-width: 640px) {
  .event-slider {
    height: 220px;
  }
}

@media (max-width: 400px) {
  .event-slider {
    height: 190px;
  }
}

.values-section {
  padding-block: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.values-heading {
  margin-top: 0.5rem;
  margin-bottom: 3rem;
}

.values-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .values-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.value-card {
  background: #ffffff;
  padding: 2rem;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
}

.value-num {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: monospace;
  color: var(--color-accent);
}

.value-title {
  margin-top: 1rem;
  font-size: 1.125rem;
  color: var(--color-ink);
}

.value-desc {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-muted);
}

.team-section {
  padding-block: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.team-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
}

@media (min-width: 768px) {
  .team-header {
    flex-direction: row;
    align-items: flex-end;
  }
}

.team-sub {
  font-size: 1.0625rem;
  color: var(--color-muted);
  max-width: 36ch;
}

.team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 2.5rem;
}

@media (min-width: 640px) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .team-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.team-card {
  display: flex;
  flex-direction: column;
}

.team-photo-placeholder {
  aspect-ratio: 1 / 1;
  background: #111820;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.team-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.team-avatar-box {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.team-initials {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-paper);
}

.team-info {
  margin-top: 1.25rem;
}

.team-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink);
}

.team-role {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-top: 0.25rem;
}

.office-section {
  padding-block: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.office-box {
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
  padding: clamp(1.25rem, 4vw, 3.5rem);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}

@media (min-width: 1024px) {
  .office-box {
    grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
    align-items: center;
    gap: 3rem;
  }
}

.office-info {
  min-width: 0;
  max-width: 100%;
}

.office-desc {
  margin-top: 1rem;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-muted);
}

.office-address {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-ink);
  word-break: break-word;
}

.office-map-container {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  box-sizing: border-box;
  aspect-ratio: 16 / 10;
  min-height: 220px;
  background: #111820;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 4px 20px rgba(11, 15, 20, 0.05);
  position: relative;
}

.office-map-iframe {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  border: 0;
  display: block;
}

.about-partners {
  padding-block: 4rem;
}

.partners-title {
  margin-block: 0.5rem 2rem;
}

.partner-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 1.25rem;
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
  font-weight: 700;
  color: var(--color-ink);
  text-decoration: none;
  white-space: nowrap;
  transition: all var(--duration) var(--ease-out);
}

.partner-pill--link:hover {
  border-color: var(--color-accent);
  box-shadow: 0 4px 12px rgba(11, 15, 20, 0.06);
  transform: translateY(-2px);
}

.partner-pill-img {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  object-fit: cover;
  flex-shrink: 0;
}

.about-residents {
  margin-top: 2rem;
}

.residents-box {
  background: #ffffff;
  border: 1px solid var(--color-border-light);
  padding: 2rem;
  border-radius: 2px;
}

.resident-item {
  margin-top: 1rem;
}

.text-accent {
  color: var(--color-accent);
}
</style>
