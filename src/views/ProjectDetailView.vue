<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { projects } from '@/data/projects'
import LeadForm from '@/components/LeadForm.vue'

const route = useRoute()
const { t } = useI18n()

const slug = computed(() => route.params.slug as string)

const project = computed(() => {
  return projects.find((p) => p.slug === slug.value) || projects[0]
})

const nextProject = computed(() => {
  if (!projects.length) return null
  const currentIndex = projects.findIndex((p) => p.slug === slug.value)
  if (currentIndex === -1 || currentIndex === projects.length - 1) {
    return projects[0] || null
  }
  return projects[currentIndex + 1] || projects[0] || null
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

        <h1 class="display case-title">{{ project.title }}</h1>
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
              <h2 class="display text-white">{{ project.title }}</h2>
              <p class="text-muted">16:10 Case Study Preview — TODO: Asl skrinshotlarni yuklang</p>
            </div>
          </div>
        </div>

        <!-- Meta bar: Client, Services, Tech stack -->
        <div class="case-meta-bar">
          <div class="meta-bar-item">
            <span class="label">Mijoz</span>
            <span class="meta-bar-val">{{ project.client }}</span>
          </div>

          <div class="meta-bar-item">
            <span class="label">Xizmatlar</span>
            <div class="meta-bar-tags">
              <span v-for="s in project.services" :key="s" class="tag-pill">{{ s }}</span>
            </div>
          </div>

          <div class="meta-bar-item">
            <span class="label">{{ t('projects.techStack') }}</span>
            <div class="meta-bar-tags">
              <span v-for="tech in project.techStack" :key="tech" class="tag-pill">{{ tech }}</span>
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
            <span class="label text-accent">01 / VAZIFA</span>
            <h2 class="h2">{{ t('projects.challenge') }}</h2>
            <p class="case-body-text">{{ project.challenge }}</p>
          </div>

          <!-- Solution -->
          <div class="col-span-12 lg:col-span-6 solution-box">
            <span class="label text-accent">02 / YECHIM</span>
            <h2 class="h2">{{ t('projects.solution') }}</h2>
            <p class="case-body-text">{{ project.solution }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Metrics -->
    <section v-if="project.results.length" class="section-py section-dark">
      <div class="container">
        <span class="label text-accent">03 / NATIJALAR</span>
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

    <!-- Next Project & CTA -->
    <section class="section-py next-project-section">
      <div class="container">
        <div v-if="nextProject" class="next-project-card">
          <span class="label text-accent">{{ t('projects.nextProject') }}</span>
          <h2 class="display next-project-title">
            <RouterLink :to="`/projects/${nextProject.slug}`" class="next-project-link">
              {{ nextProject.title }} →
            </RouterLink>
          </h2>
          <p class="next-project-desc">{{ nextProject.shortDesc }}</p>
        </div>

        <div class="case-cta-block">
          <div class="case-cta-header">
            <h3 class="h2">Shunday loyiha qurmoqchimisiz?</h3>
            <p class="case-cta-sub">Biz bilan bog‘laning va texnik yechim taklifini oling.</p>
          </div>
          <LeadForm />
        </div>
      </div>
    </section>
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
  color: var(--color-ink);
  line-height: 1;
}

.case-subtitle {
  margin-top: 1.5rem;
  font-size: 1.25rem;
  color: var(--color-muted);
  max-width: 48ch;
  line-height: 1.5;
}

.case-hero-media {
  margin-top: 3.5rem;
  border-radius: 2px;
  overflow: hidden;
}

.case-cover-img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.case-placeholder {
  min-height: 400px;
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

.next-project-card {
  padding-bottom: 4rem;
  border-bottom: 1px solid var(--color-border-light);
}

.next-project-title {
  margin-top: 1rem;
}

.next-project-link {
  color: var(--color-ink);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
}

.next-project-link:hover {
  color: var(--color-accent);
}

.next-project-desc {
  margin-top: 1rem;
  font-size: 1.125rem;
  color: var(--color-muted);
}

.case-cta-block {
  max-width: 640px;
  margin-top: 5rem;
  margin-inline: auto;
  background: #ffffff;
  padding: clamp(2rem, 5vw, 3.5rem);
  border: 1px solid var(--color-border-light);
  border-radius: 2px;
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
