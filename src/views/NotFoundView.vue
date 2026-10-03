<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <div class="not-found-page section-py">
    <div class="container not-found-container">
      <span class="not-found-code">{{ t('notFound.title') }}</span>
      <h1 class="h1 not-found-title">{{ t('notFound.heading') }}</h1>
      <p class="not-found-desc">{{ t('notFound.sub') }}</p>
      <div class="not-found-action">
        <RouterLink to="/" class="btn btn--accent">
          ← {{ t('notFound.back') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
}

.not-found-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.not-found-code {
  font-size: clamp(6rem, 15vw, 12rem);
  font-weight: 800;
  letter-spacing: -0.05em;
  color: var(--color-ink);
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
  opacity: 0.15;
}

.not-found-title {
  margin-top: -1.5rem;
  color: var(--color-ink);
}

.not-found-desc {
  margin-top: 1rem;
  font-size: 1.125rem;
  color: var(--color-muted);
  max-width: 36ch;
}

.not-found-action {
  margin-top: 2.5rem;
}
</style>
