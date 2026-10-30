<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types'
import { useCardTilt } from '@/composables/useCardTilt'

defineProps<{
  project: Project
}>()

const { t } = useI18n()

const {
  cardRef: mediaContainerRef,
  isHovered: isMediaHovered,
  cardStyle: mediaTiltStyle,
  sheenStyle: mediaSheenStyle,
  cursorTagStyle,
  onMouseEnter: onMediaEnter,
  onMouseMove: onMediaMove,
  onMouseLeave: onMediaLeave,
} = useCardTilt({
  maxTilt: 6,
  scale: 1.02,
  perspective: 900,
  glare: true,
})
</script>

<template>
  <article class="project-card">
    <RouterLink
      :to="`/projects/${project.slug}`"
      class="project-card__media-link"
      @mouseenter="onMediaEnter"
      @mousemove="onMediaMove"
      @mouseleave="onMediaLeave"
    >
      <div
        ref="mediaContainerRef"
        class="project-card__image-container"
        :style="mediaTiltStyle"
      >
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

        <!-- Specular light sheen (Marco Madonna style) -->
        <div class="project-card__sheen" :style="mediaSheenStyle" aria-hidden="true"></div>

        <!-- Magnetic Cursor Tag (David Estrada style) -->
        <div
          v-if="isMediaHovered"
          class="project-cursor-tag"
          :style="cursorTagStyle"
          aria-hidden="true"
        >
          <span>{{ t('cta.viewProject') }}</span>
          <svg class="cursor-tag__arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
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
  text-decoration: none;
  perspective: 900px;
}

.project-card__image-container {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  border-radius: 4px;
  background-color: var(--color-ink);
  transform-style: preserve-3d;
  will-change: transform;
  box-shadow: 0 8px 24px rgba(11, 15, 20, 0.08);
}

.project-card:hover .project-card__image-container {
  box-shadow: 0 16px 36px rgba(11, 15, 20, 0.15);
}

.project-card__sheen {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;
  mix-blend-mode: screen;
}

/* Floating Magnetic Tag (inspired by David Estrada) */
.project-cursor-tag {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  background: rgba(11, 15, 20, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 90, 31, 0.55);
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.35), 0 0 16px rgba(255, 90, 31, 0.22);
  white-space: nowrap;
  pointer-events: none;
  will-change: transform, opacity;
  transition: opacity 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cursor-tag__arrow {
  color: var(--color-accent);
  transition: transform 0.2s ease;
}

.project-card:hover .cursor-tag__arrow {
  transform: translate(1px, -1px);
}

@media (hover: none) or (pointer: coarse) {
  .project-cursor-tag,
  .project-card__sheen {
    display: none !important;
  }
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
