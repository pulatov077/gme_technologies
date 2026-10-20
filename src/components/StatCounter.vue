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
  align-items: center;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 1.5rem;
}

.stat-counter__value-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
  line-height: 1;
}

.stat-counter__number {
  font-size: clamp(2.5rem, 5vw, 4.25rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--color-paper, #f4f2ee);
}

.stat-counter__suffix {
  font-size: clamp(1.625rem, 3.2vw, 2.75rem);
  font-weight: 700;
  color: var(--color-accent);
  margin-left: 0.25rem;
}

.stat-counter__label {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(244, 242, 238, 0.7);
  line-height: 1.4;
  letter-spacing: 0.01em;
  text-align: center;
}
</style>
