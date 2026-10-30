<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    activeColor?: string
    dimmedColor?: string
    startOffset?: number // percentage from top of viewport when reveal starts
    endOffset?: number // percentage from top of viewport when reveal completes
  }>(),
  {
    activeColor: 'var(--color-ink)',
    dimmedColor: 'rgba(11, 15, 20, 0.22)',
    startOffset: 0.88,
    endOffset: 0.35,
  },
)

const containerRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const isReducedMotion = ref(false)

// Split into words while keeping whitespace
const tokens = computed(() => {
  if (!props.text) return []
  return props.text.split(/(\s+)/)
})

// Count actual non-whitespace words to calculate per-word milestones
const wordIndices = computed(() => {
  let wordCount = 0
  const mapping: number[] = []
  tokens.value.forEach((t) => {
    if (t.trim().length > 0) {
      mapping.push(wordCount)
      wordCount++
    } else {
      mapping.push(-1)
    }
  })
  return { totalWords: Math.max(1, wordCount), mapping }
})

function calculateProgress() {
  if (isReducedMotion.value || !containerRef.value) {
    scrollProgress.value = 1
    return
  }

  const rect = containerRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight || 800

  const startY = windowHeight * props.startOffset
  const endY = windowHeight * props.endOffset

  // Calculate normalized scroll progress through this element
  const raw = (startY - rect.top) / (startY - endY || 1)
  scrollProgress.value = Math.max(0, Math.min(1, raw))
}

let ticking = false
function onScroll() {
  if (!ticking) {
    requestAnimationFrame(() => {
      calculateProgress()
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    isReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    calculateProgress()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
  }
})

watch(
  () => props.text,
  () => {
    calculateProgress()
  },
)
</script>

<template>
  <span ref="containerRef" class="scroll-reveal-text">
    <template v-for="(token, idx) in tokens" :key="idx">
      <!-- Non-whitespace word -->
      <span
        v-if="wordIndices.mapping[idx] !== -1"
        class="reveal-word"
        :style="{
          opacity: isReducedMotion
            ? 1
            : Math.max(
                0.2,
                Math.min(
                  1,
                  (scrollProgress - (wordIndices.mapping[idx]! / wordIndices.totalWords)) * 3.5 + 0.2,
                ),
              ),
          color:
            scrollProgress >= wordIndices.mapping[idx]! / wordIndices.totalWords
              ? activeColor
              : dimmedColor,
        }"
      >{{ token }}</span>
      <!-- Whitespace spacer -->
      <span v-else>{{ token }}</span>
    </template>
  </span>
</template>

<style scoped>
.scroll-reveal-text {
  display: inline;
}

.reveal-word {
  display: inline;
  transition:
    color 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: opacity, color;
}
</style>
