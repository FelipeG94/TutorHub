<script setup>
import { computed } from 'vue'
import AppSpinner from './AppSpinner.vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value),
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit'].includes(value),
  },
})

const variantClasses = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-gray-200 text-gray-800',
  danger: 'bg-red-600 text-white',
  ghost: 'bg-transparent border text-gray-600',
}

const buttonClasses = computed(() => [
  'app-button',
  variantClasses[props.variant],
  props.loading ? 'is-loading' : '',
  props.disabled ? 'is-disabled' : '',
])
</script>

<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <AppSpinner v-if="loading" class="app-button__spinner" />
    <span v-else class="app-button__content">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid transparent;
  border-radius: 0.9rem;
  font: inherit;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease,
    background-color 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none;
}

.app-button__spinner {
  flex: 0 0 auto;
}

.app-button__content {
  display: inline-flex;
  align-items: center;
}

.bg-blue-600 {
  background: #2563eb;
}

.text-white {
  color: #ffffff;
}

.bg-gray-200 {
  background: #e5e7eb;
}

.text-gray-800 {
  color: #1f2937;
}

.bg-red-600 {
  background: #dc2626;
}

.bg-transparent {
  background: transparent;
}

.border {
  border-color: #d1d5db;
}

.text-gray-600 {
  color: #4b5563;
}
</style>