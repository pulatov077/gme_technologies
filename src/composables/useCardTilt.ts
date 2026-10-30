import { ref, computed, onMounted } from 'vue'

export interface TiltOptions {
  maxTilt?: number // Maximum rotation in degrees (e.g. 5-7deg)
  scale?: number // Subtle scale on hover (e.g. 1.015-1.02)
  perspective?: number // Perspective depth (default 1000px)
  speed?: number // Transition speed in ms when leaving
  glare?: boolean // Enable specular sheen highlight
}

export function useCardTilt(options: TiltOptions = {}) {
  const {
    maxTilt = 6,
    scale = 1.02,
    perspective = 1000,
    speed = 450,
    glare = true,
  } = options

  const cardRef = ref<HTMLElement | null>(null)
  const isHovered = ref(false)
  const rotateX = ref(0)
  const rotateY = ref(0)
  const glareX = ref(50)
  const glareY = ref(50)
  const cursorX = ref(0)
  const cursorY = ref(0)
  const isTouchDevice = ref(false)

  onMounted(() => {
    if (typeof window !== 'undefined') {
      isTouchDevice.value = window.matchMedia('(pointer: coarse)').matches
    }
  })

  function onMouseEnter(e: MouseEvent) {
    if (isTouchDevice.value) return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    isHovered.value = true
    updateCoordinates(e)
  }

  function updateCoordinates(e: MouseEvent) {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    cursorX.value = x
    cursorY.value = y

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Normalize from -1 to 1
    const normX = (x - centerX) / (centerX || 1)
    const normY = (y - centerY) / (centerY || 1)

    rotateX.value = -normY * maxTilt
    rotateY.value = normX * maxTilt

    glareX.value = Math.max(0, Math.min(100, (x / (rect.width || 1)) * 100))
    glareY.value = Math.max(0, Math.min(100, (y / (rect.height || 1)) * 100))
  }

  function onMouseMove(e: MouseEvent) {
    if (!isHovered.value || isTouchDevice.value) return
    updateCoordinates(e)
  }

  function onMouseLeave() {
    isHovered.value = false
    rotateX.value = 0
    rotateY.value = 0
  }

  const cardStyle = computed(() => {
    if (isTouchDevice.value) return {}

    if (!isHovered.value) {
      return {
        transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
        transition: `transform ${speed}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
        transformStyle: 'preserve-3d' as const,
      }
    }

    return {
      transform: `perspective(${perspective}px) rotateX(${rotateX.value.toFixed(2)}deg) rotateY(${rotateY.value.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
      transition: 'transform 90ms ease-out',
      transformStyle: 'preserve-3d' as const,
    }
  })

  const sheenStyle = computed(() => {
    if (!glare || isTouchDevice.value) return { display: 'none' }
    return {
      opacity: isHovered.value ? 1 : 0,
      background: `radial-gradient(circle 340px at ${glareX.value.toFixed(1)}% ${glareY.value.toFixed(1)}%, rgba(255, 90, 31, 0.16) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`,
      transition: isHovered.value ? 'opacity 0.2s ease-out' : 'opacity 0.4s ease-out',
    }
  })

  const cursorTagStyle = computed(() => {
    if (isTouchDevice.value) return { display: 'none' }
    return {
      transform: `translate3d(${cursorX.value}px, ${cursorY.value}px, 24px) translate(-50%, -50%) scale(${isHovered.value ? 1 : 0.6})`,
      opacity: isHovered.value ? 1 : 0,
      pointerEvents: 'none' as const,
    }
  })

  return {
    cardRef,
    isHovered,
    cardStyle,
    sheenStyle,
    cursorTagStyle,
    onMouseEnter,
    onMouseMove,
    onMouseLeave,
  }
}
