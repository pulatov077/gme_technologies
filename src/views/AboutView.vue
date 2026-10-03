<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { team } from '@/data/team'
import { partners } from '@/data/partners'
import { residents } from '@/data/residents'
import SectionHeading from '@/components/SectionHeading.vue'
import LogoMarquee from '@/components/LogoMarquee.vue'

const { t } = useI18n()

/* Event Gallery */
const eventPhotos = [
  { id: 1, src: '/images/gme-presentation-2025.jpg', alt: 'GME Technologies — AI Hackathon Presentation', placeholder: false },
  { id: 2, src: '', alt: 'Hackathon jamoamiz', placeholder: true },
  { id: 3, src: '', alt: 'Taqdimot jarayoni', placeholder: true },
  { id: 4, src: '', alt: 'Jamoa bilan', placeholder: true },
]

const activePhotoIndex = ref(0)
let galleryTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  galleryTimer = setInterval(() => {
    activePhotoIndex.value = (activePhotoIndex.value + 1) % eventPhotos.length
  }, 3500)
})

onUnmounted(() => {
  if (galleryTimer) clearInterval(galleryTimer)
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

      <!-- Event Gallery -->
      <div class="presentation-section">
        <span class="label text-accent">03 / TADBIRLAR</span>
        <h2 class="h2 story-title">AI Hackathon — Yanvar 2026</h2>

        <div class="event-gallery">
          <!-- Main Image Viewer -->
          <div class="gallery-main">
            <div
              v-for="(photo, idx) in eventPhotos"
              :key="photo.id"
              class="gallery-slide"
              :class="{ 'gallery-slide--active': idx === activePhotoIndex }"
            >
              <img
                v-if="!photo.placeholder"
                :src="photo.src"
                :alt="photo.alt"
                class="gallery-slide-img"
              />
              <div v-else class="gallery-slide-placeholder">
                <span class="placeholder-icon">📷</span>
                <span class="placeholder-label">{{ photo.alt }}</span>
              </div>
            </div>

            <!-- Overlay gradient -->
            <div class="gallery-overlay"></div>

            <!-- Caption -->
            <div class="gallery-caption">
              <div class="presentation-tags">
                <span class="presentation-tag">🤖 AI Hackathon</span>
                <span class="presentation-tag">📍 Movenpick, Samarqand</span>
                <span class="presentation-tag">📅 Yanvar 2026</span>
              </div>
            </div>

            <!-- Slide counter -->
            <div class="gallery-counter">
              {{ activePhotoIndex + 1 }} / {{ eventPhotos.length }}
            </div>
          </div>

          <!-- Thumbnail Strip -->
          <div class="gallery-thumbs">
            <button
              v-for="(photo, idx) in eventPhotos"
              :key="'thumb-' + photo.id"
              class="gallery-thumb"
              :class="{ 'gallery-thumb--active': idx === activePhotoIndex }"
              @click="activePhotoIndex = idx"
            >
              <img
                v-if="!photo.placeholder"
                :src="photo.src"
                :alt="photo.alt"
                class="gallery-thumb-img"
              />
              <div v-else class="gallery-thumb-placeholder">
                <span>📷</span>
              </div>
            </button>
          </div>
        </div>

        <div class="presentation-info">
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

/* Event Gallery */
.presentation-section {
  padding-block: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.event-gallery {
  margin-top: 1.5rem;
}

.gallery-main {
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  background: #111820;
  cursor: pointer;
}

.gallery-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.gallery-slide--active {
  opacity: 1;
}

.gallery-slide-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.gallery-main:hover .gallery-slide--active .gallery-slide-img {
  transform: scale(1.05);
}

/* Placeholder for empty photo slots */
.gallery-slide-placeholder {
  width: 100%;
  height: 100%;
  background: #111820;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.placeholder-icon {
  font-size: 3rem;
  opacity: 0.3;
}

.placeholder-label {
  font-size: 0.9375rem;
  color: rgba(244, 242, 238, 0.35);
  font-weight: 500;
}

/* Overlay gradient */
.gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    rgba(11, 15, 20, 0.65) 0%,
    rgba(11, 15, 20, 0.1) 35%,
    transparent 100%
  );
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.gallery-main:hover .gallery-overlay {
  background: linear-gradient(
    to top,
    rgba(11, 15, 20, 0.75) 0%,
    rgba(11, 15, 20, 0.15) 35%,
    transparent 100%
  );
}

/* Caption & tags */
.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.25rem 1.5rem;
  z-index: 2;
}

.presentation-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.presentation-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.4rem 0.875rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fff;
  transition: all 0.3s ease;
}

.gallery-main:hover .presentation-tag {
  background: rgba(255, 90, 31, 0.25);
  border-color: rgba(255, 90, 31, 0.4);
}

/* Slide counter */
.gallery-counter {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.375rem 0.75rem;
  background: rgba(11, 15, 20, 0.6);
  backdrop-filter: blur(6px);
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  z-index: 2;
  font-family: monospace;
}

/* Thumbnail strip */
.gallery-thumbs {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.gallery-thumb {
  flex: 1;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid transparent;
  cursor: pointer;
  background: #111820;
  padding: 0;
  transition: all 0.3s ease;
}

.gallery-thumb--active {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(255, 90, 31, 0.25);
}

.gallery-thumb:hover:not(.gallery-thumb--active) {
  border-color: rgba(255, 90, 31, 0.4);
}

.gallery-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.gallery-thumb-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0.3;
}

/* Info section below gallery */
.presentation-info {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
  margin-top: 1.5rem;
  max-width: 72ch;
}

@media (min-width: 768px) {
  .presentation-info {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
}

.presentation-desc {
  font-size: 1.0625rem;
  line-height: 1.7;
  color: var(--color-muted);
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
