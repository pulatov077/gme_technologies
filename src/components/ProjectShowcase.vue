<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types'

defineProps<{
  project: Project
  reversed?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <article
    class="project-showcase"
    :class="{ 'project-showcase--reversed': reversed }"
  >
    <!-- Media column -->
    <div class="project-showcase__media">
      <RouterLink :to="`/projects/${project.slug}`" class="project-showcase__media-link">
        <div class="project-showcase__image-container">
          <img
            v-if="project.coverImage"
            :src="project.coverImage"
            :alt="project.title"
            class="project-showcase__img"
            loading="lazy"
          />
          <div v-else class="project-placeholder">
            <span v-if="project.placeholder" class="placeholder-badge">Placeholder</span>
            <div class="project-placeholder__info">
              <span class="label project-placeholder__client">{{ project.client }}</span>
              <h3 class="h2 project-placeholder__title">{{ project.title }}</h3>
            </div>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Info column -->
    <div class="project-showcase__content">
      <div class="project-showcase__meta">
        <span class="label project-showcase__industry">{{ project.industry }}</span>
        <span class="project-showcase__divider">•</span>
        <span class="project-showcase__year">{{ project.year }}</span>
      </div>

      <h3 class="h2 project-showcase__title">
        <RouterLink :to="`/projects/${project.slug}`" class="project-showcase__title-link">
          {{ project.title }}
        </RouterLink>
      </h3>

      <p class="project-showcase__desc">{{ project.shortDesc }}</p>

      <!-- Services tags -->
      <div class="project-showcase__tags">
        <span v-for="s in project.services" :key="s" class="tag-pill">
          {{ s }}
        </span>
      </div>

      <!-- Result metrics -->
      <div v-if="project.results.length" class="project-showcase__results">
        <div
          v-for="(res, idx) in project.results.slice(0, 3)"
          :key="idx"
          class="project-showcase__result-item"
        >
          <span class="project-showcase__result-val">{{ res.value }}</span>
          <span class="project-showcase__result-label">{{ res.label }}</span>
        </div>
      </div>

      <!-- CTA -->
      <div class="project-showcase__cta">
        <RouterLink :to="`/projects/${project.slug}`" class="btn btn--dark">
          {{ t('projects.viewCase') }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14m-7-7 7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-showcase {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
  padding-block: clamp(3rem, 6vw, 5rem);
  border-top: 1px solid var(--color-border-light);
}

@media (min-width: 1024px) {
  .project-showcase {
    grid-template-columns: 7fr 5fr;
  }

  .project-showcase--reversed {
    grid-template-columns: 5fr 7fr;
  }

  .project-showcase--reversed .project-showcase__media {
    order: 2;
  }

  .project-showcase--reversed .project-showcase__content {
    order: 1;
  }
}

.project-showcase__media-link {
  display: block;
  overflow: hidden;
  text-decoration: none;
}

.project-showcase__image-container {
  aspect-ratio: 16 / 10;
  border-radius: 2px;
  overflow: hidden;
  background-color: var(--color-ink);
  transition: transform 0.4s var(--ease-out);
}

.project-showcase:hover .project-showcase__image-container {
  box-shadow: 0 20px 40px rgba(11, 15, 20, 0.12);
}

.project-showcase__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease-out);
}

.project-showcase:hover .project-showcase__img {
  transform: scale(1.02);
}

.project-placeholder__client {
  color: var(--color-accent);
  display: block;
  margin-bottom: 0.5rem;
}

.project-placeholder__title {
  color: #ffffff;
  line-height: 1.15;
}

.project-showcase__content {
  display: flex;
  flex-direction: column;
}

.project-showcase__meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.project-showcase__industry {
  color: var(--color-accent);
}

.project-showcase__divider {
  color: var(--color-border-light);
  font-size: 0.75rem;
}

.project-showcase__year {
  font-size: 0.8125rem;
  color: var(--color-muted);
  font-variant-numeric: tabular-nums;
}

.project-showcase__title-link {
  color: var(--color-ink);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
}

.project-showcase__title-link:hover {
  color: var(--color-accent);
}

.project-showcase__desc {
  margin-top: 1.25rem;
  font-size: 1.0625rem;
  line-height: 1.6;
  color: var(--color-muted);
}

.project-showcase__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.project-showcase__results {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light);
}

.project-showcase__result-item {
  display: flex;
  flex-direction: column;
}

.project-showcase__result-val {
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  line-height: 1.1;
}

.project-showcase__result-label {
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-muted);
  line-height: 1.3;
}

.project-showcase__cta {
  margin-top: 2.25rem;
}
</style>
