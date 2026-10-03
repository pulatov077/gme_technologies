<script setup lang="ts">
interface Props {
  speed?: number // seconds per cycle
  pauseOnHover?: boolean
}

withDefaults(defineProps<Props>(), {
  speed: 25,
  pauseOnHover: true,
})
</script>

<template>
  <div
    class="marquee-container"
    :class="{ 'marquee-container--pause-hover': pauseOnHover }"
  >
    <div
      class="marquee-content"
      :style="{ '--marquee-duration': `${speed}s` }"
    >
      <div class="marquee-track">
        <slot />
      </div>
      <div class="marquee-track" aria-hidden="true">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-container {
  overflow: hidden;
  position: relative;
  width: 100%;
  padding-block: 0.75rem;
  margin-block: -0.75rem;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

.marquee-content {
  display: flex;
  width: max-content;
  animation: marquee-scroll var(--marquee-duration) linear infinite;
}

.marquee-container--pause-hover:hover .marquee-content {
  animation-play-state: paused;
}

.marquee-track {
  display: flex;
  align-items: center;
  gap: clamp(2rem, 5vw, 4.5rem);
  padding-right: clamp(2rem, 5vw, 4.5rem);
  padding-block: 0.75rem;
  flex-shrink: 0;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee-content {
    animation: none;
    overflow-x: auto;
  }
}
</style>
