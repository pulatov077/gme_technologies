<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { projects, getLocalizedProject } from '@/data/projects'
import LeadForm from '@/components/LeadForm.vue'

const route = useRoute()
const { t, locale } = useI18n()

const slug = computed(() => route.params.slug as string)

const project = computed(() => {
  const raw = projects.find((p) => p.slug === slug.value) || projects[0]
  return raw ? getLocalizedProject(raw, locale.value) : null
})

const activePreviewImg = ref<string | null>(null)

function openPreview(img: string) {
  activePreviewImg.value = img
  document.body.style.overflow = 'hidden'
}

function closePreview() {
  activePreviewImg.value = null
  document.body.style.overflow = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && activePreviewImg.value) {
    closePreview()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <div v-if="project" class="project-detail-page">
    <!-- Hero / Case Study Header -->
    <section class="section-py case-hero">
      <div class="container">
        <div class="case-back-link">
          <RouterLink to="/projects" class="back-link">
            ← {{ t('cta.back') }}: {{ t('projects.title') }}
          </RouterLink>
        </div>

        <div class="case-meta">
          <span class="label text-accent">{{ project.industry }}</span>
          <span class="meta-dot">•</span>
          <span class="case-year">{{ project.year }}</span>
          <span v-if="project.placeholder" class="placeholder-badge">Placeholder</span>
        </div>

        <h1 class="case-title">{{ project.title }}</h1>
        <p class="case-subtitle">{{ project.shortDesc }}</p>

        <!-- Project Hero Media -->
        <div class="case-hero-media">
          <img
            v-if="project.coverImage"
            :src="project.coverImage"
            :alt="project.title"
            class="case-cover-img"
          />
          <div v-else class="project-placeholder case-placeholder">
            <div class="placeholder-content">
              <span class="label text-accent">{{ project.client }}</span>
              <h2 class="h2 text-white">{{ project.title }}</h2>
              <p class="text-muted">Case Study Preview</p>
            </div>
          </div>
        </div>

        <!-- Meta bar: Client, Services, Tech stack, Links -->
        <div class="case-meta-bar">
          <div class="meta-bar-item">
            <span class="label">{{ t('projectDetail.client') }}</span>
            <span class="meta-bar-val">{{ project.client }}</span>
          </div>

          <div class="meta-bar-item">
            <span class="label">{{ t('projectDetail.services') }}</span>
            <div class="meta-bar-tags">
              <span v-for="s in project.services" :key="s" class="tag-pill">{{ s }}</span>
            </div>
          </div>

          <div class="meta-bar-item">
            <span class="label">{{ t('projectDetail.techStack') }}</span>
            <div class="meta-bar-tags">
              <span v-for="tech in project.techStack" :key="tech" class="tag-pill">{{ tech }}</span>
            </div>
          </div>

          <!-- Direct Links (Live, Bot, GitHub) -->
          <div v-if="project.liveUrl || project.botUrl || project.githubUrl || project.backendGithubUrl" class="meta-bar-item">
            <span class="label">{{ t('projectDetail.linksAndSource') }}</span>
            <div class="meta-bar-links">
              <a
                v-if="project.liveUrl"
                :href="project.liveUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-ext-link project-ext-link--live"
              >
                <span>🌐 {{ t('projectDetail.liveLink') }}</span> ↗
              </a>
              <a
                v-if="project.botUrl"
                :href="project.botUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-ext-link project-ext-link--tg"
              >
                <span>🤖 {{ t('projectDetail.botLink') }}</span> ↗
              </a>
              <a
                v-if="project.githubUrl"
                :href="project.githubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-ext-link"
              >
                <span>💻 {{ project.backendGithubUrl ? t('projectDetail.sourceFrontendLink') : t('projectDetail.sourceLink') }}</span> ↗
              </a>
              <a
                v-if="project.backendGithubUrl"
                :href="project.backendGithubUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="project-ext-link"
              >
                <span>⚙️ {{ t('projectDetail.backendLink') }}</span> ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Challenge & Solution Section -->
    <section class="section-py section-challenge">
      <div class="container">
        <div class="grid-12">
          <!-- Challenge -->
          <div class="col-span-12 lg:col-span-6 challenge-box">
            <span class="label text-accent">{{ t('projectDetail.challengeLabel') }}</span>
            <h2 class="h2">{{ t('projects.challenge') }}</h2>
            <p class="case-body-text">{{ project.challenge }}</p>
          </div>

          <!-- Solution -->
          <div class="col-span-12 lg:col-span-6 solution-box">
            <span class="label text-accent">{{ t('projectDetail.solutionLabel') }}</span>
            <h2 class="h2">{{ t('projects.solution') }}</h2>
            <p class="case-body-text">{{ project.solution }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Project Gallery / Screenshots Section -->
    <section v-if="project.gallery && project.gallery.length" class="section-py section-gallery">
      <div class="container">
        <span class="label text-accent">{{ t('projectDetail.interfacesLabel') }}</span>
        <h2 class="h2 gallery-heading">{{ t('projectDetail.galleryTitle') }}</h2>
        <p class="gallery-sub">{{ t('projectDetail.gallerySub') }}</p>

        <div
          class="case-gallery-grid"
          :class="`case-gallery-grid--${project.galleryLayout || 'portrait'}`"
        >
          <div
            v-for="(img, idx) in project.gallery"
            :key="idx"
            class="case-gallery-card"
            @click="openPreview(img)"
          >
            <div class="case-gallery-img-wrap">
              <img
                :src="img"
                :alt="`${project.title} screenshot ${idx + 1}`"
                class="case-gallery-img"
                loading="lazy"
              />
              <div class="gallery-zoom-badge" aria-hidden="true">
                <span>🔍</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Metrics -->
    <section v-if="project.results.length" class="section-py section-dark">
      <div class="container">
        <span class="label text-accent">{{ t('projectDetail.resultsLabel') }}</span>
        <h2 class="h2 text-white section-margin-top">{{ t('projects.results') }}</h2>

        <div class="results-grid">
          <div
            v-for="(res, idx) in project.results"
            :key="idx"
            class="result-metric-card"
          >
            <span class="result-number">{{ res.value }}</span>
            <span class="result-label">{{ res.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Case CTA Block -->
    <section class="section-py case-cta-section">
      <div class="container">
        <div class="case-cta-block">
          <div class="case-cta-header">
            <h3 class="h2">{{ t('projectDetail.ctaTitle') }}</h3>
            <p class="case-cta-sub">{{ t('projectDetail.ctaSub') }}</p>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>

    <!-- Image Lightbox Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="activePreviewImg"
          class="gallery-lightbox"
          @click.self="closePreview"
          role="dialog"
          aria-modal="true"
        >
          <div class="lightbox-dialog">
            <button
              class="lightbox-close"
              type="button"
              @click="closePreview"
              aria-label="Yopish"
            >
              ✕
            </button>
            <img
              :src="activePreviewImg"
              :alt="project.title"
              class="lightbox-img"
            />
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.case-back-link {
  margin-bottom: 2rem;
}

.back-link {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-muted);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
}

.back-link:hover {
  color: var(--color-ink);
}

.case-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.meta-dot {
  color: var(--color-border-light);
}

.case-year {
  font-size: 0.875rem;
  color: var(--color-muted);
}

.case-title {
  font-size: clamp(1.625rem, 3.2vw, 2.375rem);
  font-weight: 800;
  color: var(--color-ink);
  line-height: 1.25;
  letter-spacing: -0.025em;
  max-width: 32ch;
}

.case-subtitle {
  margin-top: 1rem;
  font-size: 1.0625rem;
  color: var(--color-muted);
  max-width: 54ch;
  line-height: 1.6;
}

.case-hero-media {
  margin-top: 2.5rem;
  border-radius: 8px;
  overflow: hidden;
  max-width: 720px;
  height: 380px;
  background: #0b0f14;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 12px 36px rgba(11, 15, 20, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.case-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

@media (max-width: 640px) {
  .case-hero-media {
    height: 260px;
  }
}

.case-placeholder {
  min-height: 280px;
}

.placeholder-content {
  margin-top: auto;
}

.text-muted {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: rgba(244, 242, 238, 0.5);
}

.case-meta-bar {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-top: 3rem;
  padding-block: 2rem;
  border-block: 1px solid var(--color-border-light);
}

@media (min-width: 768px) {
  .case-meta-bar {
    grid-template-columns: repeat(3, 1fr);
  }
}

.meta-bar-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-bar-val {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-ink);
}

.meta-bar-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.meta-bar-links {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.project-ext-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
  width: fit-content;
}

.project-ext-link:hover {
  color: var(--color-accent);
}

.project-ext-link--tg,
.project-ext-link--live {
  color: var(--color-accent);
}

/* Gallery Section */
.section-gallery {
  background: var(--color-paper);
  border-top: 1px solid var(--color-border-light);
}

.gallery-heading {
  margin-top: 0.5rem;
}

.gallery-sub {
  margin-top: 0.5rem;
  font-size: 1.0625rem;
  color: var(--color-muted);
  max-width: 48ch;
}

.case-gallery-grid {
  display: grid;
  gap: 1.75rem;
  margin-top: 3rem;
}

/* Portrait (Mobile Mini Apps, smartphones) */
.case-gallery-grid--portrait {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .case-gallery-grid--portrait {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .case-gallery-grid--portrait {
    grid-template-columns: repeat(4, 1fr);
  }
}

.case-gallery-grid--portrait .case-gallery-img-wrap {
  aspect-ratio: 9 / 19.5;
  background: #0b0f14;
}

.case-gallery-grid--portrait .case-gallery-img {
  object-fit: cover;
  object-position: top;
}

/* Landscape (Web platforms, Dashboards, Desktop sites - ORZU) */
.case-gallery-grid--landscape {
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .case-gallery-grid--landscape {
    grid-template-columns: repeat(2, 1fr);
  }
}

.case-gallery-grid--landscape .case-gallery-img-wrap {
  aspect-ratio: 16 / 9;
  background: #0b0f14;
}

.case-gallery-grid--landscape .case-gallery-img {
  object-fit: cover;
  object-position: top;
}

.case-gallery-card {
  border-radius: 8px;
  overflow: hidden;
  background: #111820;
  border: 1px solid var(--color-border-light);
  box-shadow: 0 4px 20px rgba(11, 15, 20, 0.06);
  transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out), border-color 0.3s var(--ease-out);
  cursor: pointer;
  position: relative;
}

.case-gallery-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 36px rgba(11, 15, 20, 0.14);
  border-color: rgba(235, 94, 40, 0.35);
}

.case-gallery-img-wrap {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.case-gallery-img {
  width: 100%;
  height: 100%;
  display: block;
  transition: transform 0.4s ease;
}

.case-gallery-card:hover .case-gallery-img {
  transform: scale(1.02);
}

.gallery-zoom-badge {
  position: absolute;
  right: 0.75rem;
  bottom: 0.75rem;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(11, 15, 20, 0.75);
  backdrop-filter: blur(4px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  opacity: 0;
  transform: scale(0.85);
  transition: opacity 0.25s ease, transform 0.25s ease;
  pointer-events: none;
}

.case-gallery-card:hover .gallery-zoom-badge {
  opacity: 1;
  transform: scale(1);
}

/* Lightbox Modal */
.gallery-lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(11, 15, 20, 0.92);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.lightbox-dialog {
  position: relative;
  max-width: 94vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-img {
  max-width: 100%;
  max-height: 88vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid var(--color-border);
}

.lightbox-close {
  position: absolute;
  top: -2.75rem;
  right: 0;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, transform 0.2s;
}

.lightbox-close:hover {
  background: var(--color-accent);
  transform: scale(1.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.challenge-box,
.solution-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.case-body-text {
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-muted);
}

.section-margin-top {
  margin-top: 0.75rem;
  margin-bottom: 3rem;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 640px) {
  .results-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.result-metric-card {
  border-left: 2px solid var(--color-accent);
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.result-number {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  line-height: 1;
}

.result-label {
  font-size: 0.875rem;
  color: rgba(244, 242, 238, 0.6);
}

.case-cta-block {
  max-width: 640px;
  margin-top: 1rem;
  margin-inline: auto;
  background: #ffffff;
  padding: clamp(2rem, 5vw, 3.5rem);
  border: 1px solid var(--color-border-light);
  border-radius: 4px;
}

.case-cta-header {
  margin-bottom: 2rem;
}

.case-cta-sub {
  margin-top: 0.5rem;
  color: var(--color-muted);
}

.text-accent {
  color: var(--color-accent);
}

.text-white {
  color: #ffffff;
}
</style>
