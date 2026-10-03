<script setup lang="ts">
interface Props {
  label?: string
  title: string
  subtitle?: string
  dark?: boolean
  align?: 'left' | 'center'
}

withDefaults(defineProps<Props>(), {
  label: '',
  subtitle: '',
  dark: false,
  align: 'left',
})
</script>

<template>
  <div
    class="section-heading"
    :class="[
      `section-heading--${align}`,
      { 'section-heading--dark': dark }
    ]"
  >
    <div v-if="label" class="section-heading__label-wrapper">
      <span class="label section-heading__label">{{ label }}</span>
    </div>
    <h2 class="h2 section-heading__title">{{ title }}</h2>
    <p v-if="subtitle" class="section-heading__subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.section-heading {
  margin-bottom: clamp(2.5rem, 5vw, 4rem);
}

.section-heading--center {
  text-align: center;
}

.section-heading__label-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.section-heading--center .section-heading__label-wrapper {
  justify-content: center;
}

.section-heading__label {
  color: var(--color-accent);
}

.section-heading__title {
  color: var(--color-ink);
  max-width: 24ch;
  line-height: 1.1;
}

.section-heading--center .section-heading__title {
  margin-inline: auto;
}

.section-heading--dark .section-heading__title {
  color: var(--color-paper);
}

.section-heading__subtitle {
  margin-top: 1rem;
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--color-muted);
  max-width: 48ch;
}

.section-heading--center .section-heading__subtitle {
  margin-inline: auto;
}

.section-heading--dark .section-heading__subtitle {
  color: rgba(244, 242, 238, 0.6);
}
</style>
