<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Project } from '@/types'
import { useCardTilt } from '@/composables/useCardTilt'

defineProps<{
  project: Project
  reversed?: boolean
}>()

const { t } = useI18n()

// 3D Tilt & Magnetic Cursor Tag (inspired by Marco Madonna & David Estrada)
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
  maxTilt: 4.5,
  scale: 1.015,
  perspective: 1200,
  glare: true,
})

// Scroll-reveal animation
const showcaseEl = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

onMounted(async () => {
  await nextTick()
  const el = showcaseEl.value
  if (!el) return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return

  // Get child elements
  const media = el.querySelector('.project-showcase__media') as HTMLElement | null
  const content = el.querySelector('.project-showcase__content') as HTMLElement | null
  if (!media && !content) return

  // Set initial hidden state via inline styles
  const targets = [media, content].filter(Boolean) as HTMLElement[]
  targets.forEach((t, i) => {
    t.style.opacity = '0'
    t.style.transform = 'translateY(36px)'
    t.style.transition = `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.12}s`
  })

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        targets.forEach((t) => {
          t.style.opacity = '1'
          t.style.transform = 'translateY(0)'
        })
        observer?.disconnect()
      }
    },
    { threshold: 0.02, rootMargin: '0px 0px -20px 0px' },
  )
  observer.observe(el)

  // Safety fallback: ensure content is revealed after 1.2s on mobile/tablets
  setTimeout(() => {
    targets.forEach((t) => {
      t.style.opacity = '1'
      t.style.transform = 'translateY(0)'
    })
  }, 1200)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <article
    ref="showcaseEl"
    class="project-showcase"
    :class="{ 'project-showcase--reversed': reversed }"
  >
    <!-- Media column -->
    <div class="project-showcase__media">
      <RouterLink
        :to="`/projects/${project.slug}`"
        class="project-showcase__media-link"
        @mouseenter="onMediaEnter"
        @mousemove="onMediaMove"
        @mouseleave="onMediaLeave"
      >
        <div
          ref="mediaContainerRef"
          class="project-showcase__image-container"
          :style="mediaTiltStyle"
        >
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

          <!-- Dynamic specular sheen (Marco Madonna style) -->
          <div class="project-showcase__sheen" :style="mediaSheenStyle" aria-hidden="true"></div>

          <!-- Magnetic Floating Cursor Badge (David Estrada style) -->
          <div
            v-if="isMediaHovered"
            class="project-cursor-tag"
            :style="cursorTagStyle"
            aria-hidden="true"
          >
            <span class="cursor-tag__text">{{ t('projects.viewCase') }}</span>
            <svg class="cursor-tag__arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4.5 11.5l7-7M5.5 4.5h6v6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
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
  text-decoration: none;
  perspective: 1200px;
}

.project-showcase__image-container {
  position: relative;
  aspect-ratio: 16 / 10;
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--color-ink);
  transform-style: preserve-3d;
  will-change: transform;
  box-shadow: 0 10px 30px rgba(11, 15, 20, 0.08);
}

.project-showcase:hover .project-showcase__image-container {
  box-shadow: 0 24px 48px rgba(11, 15, 20, 0.16);
}

.project-showcase__sheen {
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
  gap: 0.5rem;
  padding: 0.5rem 0.95rem;
  background: rgba(11, 15, 20, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 90, 31, 0.55);
  border-radius: 999px;
  color: #ffffff;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 90, 31, 0.25);
  white-space: nowrap;
  pointer-events: none;
  will-change: transform, opacity;
  transition: opacity 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.cursor-tag__arrow {
  color: var(--color-accent);
  transition: transform 0.2s ease;
}

.project-showcase:hover .cursor-tag__arrow {
  transform: translate(1px, -1px);
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
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1.25rem 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border-light);
}

@media (max-width: 480px) {
  .project-showcase__results {
    grid-template-columns: repeat(2, 1fr);
  }
}

.project-showcase__result-item {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.project-showcase__result-val {
  font-size: clamp(1.15rem, 3.5vw, 1.75rem);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--color-ink);
  line-height: 1.15;
  overflow-wrap: break-word;
  word-break: break-word;
}

.project-showcase__result-label {
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: var(--color-muted);
  line-height: 1.35;
  overflow-wrap: break-word;
}

.project-showcase__cta {
  margin-top: 2.25rem;
}
</style>
