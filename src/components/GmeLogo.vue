<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="gme-logo-mark"
  >
    <!-- GME Precision Geometric G Monogram -->
    <!-- Top-Right Accent Slice -->
    <path
      d="M20 4H30L32 6L26 12H16L20 4Z"
      fill="var(--color-accent, #FF5A1F)"
    />
    <!-- Main Angular G Body -->
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M10 4L4 10V26L10 32H26L32 26V16H18V21H26V24.5L24.5 26H11.5L9 23.5V12.5L11.5 10H14.5L17.5 7H10L10 4Z"
      fill="var(--color-accent, #FF5A1F)"
    />
  </svg>
</template>

<script setup lang="ts">
interface Props {
  size?: number | string
}

withDefaults(defineProps<Props>(), {
  size: 32,
})
</script>

<style scoped>
.gme-logo-mark {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>
