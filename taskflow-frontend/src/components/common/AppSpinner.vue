<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
  color: {
    type: String,
    default: 'currentColor',
  },
})

const sizeStyles = {
  sm: '0.875rem',
  md: '1rem',
  lg: '1.5rem',
}

const spinnerStyle = computed(() => ({
  width: sizeStyles[props.size],
  height: sizeStyles[props.size],
  color: props.color,
}))
</script>

<template>
  <span class="app-spinner" :style="spinnerStyle" aria-hidden="true"></span>
</template>

<style scoped>
.app-spinner {
  display: inline-block;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 999px;
  animation: app-spinner-spin 0.75s linear infinite;
}

@keyframes app-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>