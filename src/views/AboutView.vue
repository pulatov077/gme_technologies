<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { team } from '@/data/team'
import { partners } from '@/data/partners'
import { residents } from '@/data/residents'
import SectionHeading from '@/components/SectionHeading.vue'
import LogoMarquee from '@/components/LogoMarquee.vue'

const { t } = useI18n()

/* Event Gallery Slider */
const eventPhotos = [
  { id: 1, src: '/images/gme-presentation-2025.jpg', alt: 'GME Technologies — AI Hackathon Presentation', placeholder: false },
  { id: 2, src: '', alt: 'AI Hackathon Jamoasi', placeholder: true },
  { id: 3, src: '', alt: 'Loyiha Taqdimoti Jarayoni', placeholder: true },
  { id: 4, src: '', alt: 'Hamkorlar va GME Jamoasi', placeholder: true },
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

const values = [
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
]
</script>

<template>
  <div class="about-page section-py">
    <div class="container">
      <!-- Section Heading -->
      <SectionHeading
        label="KOMPANIYA"
        :title="t('about.title')"
        subtitle="Samarqandda joylashgan, O‘zbekiston miqyosida raqamli loyihalarni amalga oshiruvchi muhandislik jamoasi."
      />

      <!-- Story & Mission Grid -->
      <div class="story-grid">
        <div class="story-block">
          <span class="label text-accent">01 / TARIX</span>
          <h2 class="h2 story-title">{{ t('about.storyTitle') }}</h2>
          <p class="story-text">{{ t('about.storyText') }}</p>
        </div>

        <div class="story-block">
          <span class="label text-accent">02 / MISSIYA</span>
          <h2 class="h2 story-title">{{ t('about.missionTitle') }}</h2>
          <p class="story-text">{{ t('about.missionText') }}</p>
        </div>
      </div>

      <!-- Event Section -->
      <div class="presentation-section">
        <div class="presentation-layout">
          <!-- Text Info Left Side -->
          <div class="presentation-info-side">
            <span class="label text-accent">03 / TADBIRLAR</span>
            <h2 class="h2 story-title">AI Hackathon — Yanvar 2026</h2>
            <div class="presentation-texts">
              <p class="presentation-desc">
                2026-yil yanvar oyida GME Technologies jamoasi Samarqand shahridagi Movenpick
                mehmonxonasida bo'lib o'tgan AI Hackathon tadbirida qatnashib, o'z loyihamizni
                taqdimot qildi. Tadbirda IT Park, School 21, Ucell va Uztelecom hamkorlik qilishdi.
              </p>
              <p class="presentation-desc">
                Bu tadbir kompaniyamiz uchun muhim qadam bo'ldi — biz sun'iy intellekt
                texnologiyalarini biznes yechimlarga tatbiq etish bo'yicha innovatsion
                g'oyalarimizni namoyish etdik.
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
        <span class="label text-accent">TAMOYILLAR</span>
        <h2 class="h2 values-heading">{{ t('about.valuesTitle') }}</h2>

        <div class="values-grid">
          <div v-for="val in values" :key="val.num" class="value-card">
            <span class="value-num">{{ val.num }}</span>
            <h3 class="h3 value-title">{{ val.title }}</h3>
            <p class="value-desc">{{ val.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="team-section">
        <div class="team-header">
          <div>
            <span class="label text-accent">JAMOA</span>
            <h2 class="h2">{{ t('about.team') }}</h2>
          </div>
          <p class="team-sub">
            Loyiha muvaffaqiyatining negizi — tajribali mutaxassislarimiz.
          </p>
        </div>

        <!-- Dev Note -->
        <div class="dev-note">
          <span class="dev-badge">TODO</span>
          <span>Haqiqiy jamoa a’zolarining rasmlari va ma’lumotlari <code>src/data/team.ts</code> fayliga kiritilishi lozim.</span>
        </div>

        <div class="team-grid">
          <div v-for="member in team" :key="member.id" class="team-card">
            <div class="team-photo-placeholder">
              <div class="team-avatar-box">
                <span class="team-initials">{{ member.name.charAt(0) }}</span>
              </div>
              <span v-if="member.placeholder" class="placeholder-badge">Placeholder</span>
            </div>
            <div class="team-info">
              <h3 class="team-name">{{ member.name }}</h3>
              <p class="team-role">{{ member.role }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Office in Samarkand -->
      <div class="office-section">
        <div class="office-box">
          <div class="office-info">
            <span class="label text-accent">LOKATSIYA</span>
            <h2 class="h2">Samarqanddagi bosh ofis</h2>
            <p class="office-desc">
              Biz Samarqand shahrining markazida faoliyat yuritamiz. Mijozlarimiz bilan yuzma-yuz uchrashib, loyihalarni batafsil rejalashtirish uchun eshiklarimiz doimo ochiq.
            </p>
            <div class="office-address">
              <p><strong>Manzil:</strong> Samarqand shahri, Universitet xiyoboni — TODO</p>
              <p><strong>Ish vaqti:</strong> Dushanba – Juma, 09:00 – 18:00</p>
            </div>
          </div>
          <div class="office-placeholder-map">
            <div class="map-grid-pattern">
              <span class="map-marker-dot"></span>
              <span class="map-label">Samarqand ofisi (TODO: Xarita ulash)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Partners marquee -->
      <div class="about-partners">
        <span class="label text-accent">HAMKORLIK</span>
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
.story-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  padding-block: 2rem 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

@media (min-width: 768px) {
  .story-grid {
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }
}

.story-block {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.story-title {
  color: var(--color-ink);
}

.story-text {
  font-size: 1.0625rem;
  line-height: 1.6;
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

.dev-note {
  background: rgba(255, 90, 31, 0.08);
  border: 1px solid rgba(255, 90, 31, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 2px;
  margin-top: 1.5rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
}

.dev-badge {
  font-weight: 800;
  color: var(--color-accent);
}

.team-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
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
  border-radius: 2px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: clamp(2rem, 5vw, 3.5rem);
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 1024px) {
  .office-box {
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
  }
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
}

.office-placeholder-map {
  aspect-ratio: 16 / 10;
  background: #111820;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border: 1px solid var(--color-border);
}

.map-grid-pattern {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.map-marker-dot {
  width: 12px;
  height: 12px;
  background: var(--color-accent);
  border-radius: 50%;
  box-shadow: 0 0 12px var(--color-accent);
}

.map-label {
  font-size: 0.8125rem;
  color: rgba(244, 242, 238, 0.7);
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
