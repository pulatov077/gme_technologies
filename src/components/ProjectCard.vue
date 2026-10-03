<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types'

defineProps<{
  project: Project
}>()

const { t } = useI18n()
</script>

<template>
  <article class="project-card">
    <RouterLink :to="`/projects/${project.slug}`" class="project-card__media-link">
      <div class="project-card__image-container">
        <img
          v-if="project.coverImage"
          :src="project.coverImage"
          :alt="project.title"
          class="project-card__img"
          loading="lazy"
        />
        <div v-else class="project-placeholder">
          <span v-if="project.placeholder" class="placeholder-badge">Placeholder</span>
          <div class="project-placeholder__info">
            <span class="label project-placeholder__client">{{ project.client }}</span>
            <h3 class="h3 project-placeholder__title">{{ project.title }}</h3>
          </div>
        </div>
      </div>
    </RouterLink>

    <div class="project-card__body">
      <div class="project-card__meta">
        <span class="label project-card__industry">{{ project.industry }}</span>
        <span class="project-card__year">{{ project.year }}</span>
      </div>

      <h3 class="h3 project-card__title">
        <RouterLink :to="`/projects/${project.slug}`" class="project-card__title-link">
          {{ project.title }}
        </RouterLink>
      </h3>

      <p class="project-card__desc">{{ project.shortDesc }}</p>

      <div class="project-card__tags">
        <span v-for="s in project.services" :key="s" class="tag-pill">
          {{ s }}
        </span>
      </div>

      <div class="project-card__footer">
        <RouterLink :to="`/projects/${project.slug}`" class="project-card__link">
          {{ t('cta.viewProject') }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M5 12h14m-7-7 7 7-7 7"/>
          </svg>
        </RouterLink>
      </div>
    </div>
  </article>
</template>

<style scoped>
.project-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-bottom: 1px solid var(--color-border-light);
  padding-bottom: 2rem;
}

.project-card__media-link {
  display: block;
  overflow: hidden;
  text-decoration: none;
}

.project-card__image-container {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 2px;
  background-color: var(--color-ink);
}

.project-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover .project-card__img {
  transform: scale(1.03);
}

.project-placeholder__info {
  margin-top: auto;
}

.project-placeholder__client {
  color: var(--color-accent);
  display: block;
  margin-bottom: 0.5rem;
}

.project-placeholder__title {
  color: #ffffff;
  line-height: 1.2;
}

.project-card__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-top: 1.5rem;
}

.project-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.project-card__industry {
  color: var(--color-muted);
}

.project-card__year {
  font-size: 0.8125rem;
  color: var(--color-muted);
  font-variant-numeric: tabular-nums;
}

.project-card__title {
  font-size: 1.25rem;
  line-height: 1.3;
}

.project-card__title-link {
  color: var(--color-ink);
  text-decoration: none;
  transition: color var(--duration) var(--ease-out);
}

.project-card__title-link:hover {
  color: var(--color-accent);
}

.project-card__desc {
  font-size: 0.9375rem;
  color: var(--color-muted);
  line-height: 1.5;
  margin-block: 0.75rem 1rem;
}

.project-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
}

.project-card__footer {
  margin-top: auto;
}

.project-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
  transition: gap 0.2s var(--ease-out), color 0.2s var(--ease-out);
}

.project-card__link:hover {
  color: var(--color-accent);
  gap: 0.75rem;
}
</style>
