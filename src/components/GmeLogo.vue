<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    class="gme-logo-mark"
  >
    <!-- Geometric G Monogram -->
    <!-- Top-Right Accent Slice -->
    <path
      d="M23 4H33L26.5 12H16.5L23 4Z"
      fill="var(--color-accent, #FF5A1F)"
    />
    <!-- Main Angular G Body -->
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M19 4L13.5 10.5H7V24L14.5 32H29L35 25.5V16H21V22.5H28V24L25.5 26.5H16L12 22.5V15H17.5L23.5 8H30.5L34 4H19Z"
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
