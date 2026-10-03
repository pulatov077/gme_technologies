<script setup lang="ts">
import { useReveal } from '@/composables/useReveal'
import { useCounter } from '@/composables/useCounter'

interface Props {
  value: number
  suffix?: string
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  suffix: '',
})

const { el, isVisible } = useReveal(0.2)
const { current } = useCounter(props.value, 1800, isVisible)
</script>

<template>
  <div ref="el" class="stat-counter">
    <div class="stat-counter__value-wrapper">
      <span class="stat-counter__number">{{ current }}</span>
      <span v-if="suffix" class="stat-counter__suffix">{{ suffix }}</span>
    </div>
    <p class="stat-counter__label">{{ label }}</p>
  </div>
</template>

<style scoped>
.stat-counter {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--color-border-light);
  padding-top: 1.5rem;
}

:deep(.section-dark) .stat-counter {
  border-top-color: var(--color-border);
}

.stat-counter__value-wrapper {
  display: flex;
  align-items: baseline;
  line-height: 1;
}

.stat-counter__number {
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-ink);
}

:deep(.section-dark) .stat-counter__number {
  color: var(--color-paper);
}

.stat-counter__suffix {
  font-size: clamp(1.75rem, 3.5vw, 3rem);
  font-weight: 700;
  color: var(--color-accent);
  margin-left: 0.25rem;
}

.stat-counter__label {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-muted);
  line-height: 1.4;
}

:deep(.section-dark) .stat-counter__label {
  color: rgba(244, 242, 238, 0.6);
}
</style>
