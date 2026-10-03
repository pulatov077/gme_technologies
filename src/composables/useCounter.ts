import { ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'

export function useCounter(
  target: number,
  duration = 1800,
  triggerRef: Ref<boolean>,
) {
  const current = ref(0)
  let rafId: number | null = null
  let started = false

  const start = () => {
    if (started) return
    started = true

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      current.value = target
      return
    }

    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out-expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      current.value = Math.round(eased * target)

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      }
    }
    rafId = requestAnimationFrame(tick)
  }

  const stopWatch = watch(
    triggerRef,
    (val) => {
      if (val) start()
    },
    { immediate: true },
  )

  onUnmounted(() => {
    if (rafId !== null) cancelAnimationFrame(rafId)
    stopWatch()
  })

  return { current }
}
