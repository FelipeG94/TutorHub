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
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  font: inherit;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1;
  cursor: pointer;
  transition:
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.app-button:active:not(:disabled) {
  transform: translateY(0);
}

.app-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
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
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.bg-blue-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.5);
}

.text-white {
  color: #ffffff;
}

.bg-gray-200 {
  background: #dbeafe;
  color: #1e40af;
}

.bg-gray-200:hover:not(:disabled) {
  background: #93c5fd;
}

.text-gray-800 {
  color: #1f2937;
}

.bg-red-600 {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.bg-red-600:hover:not(:disabled) {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  box-shadow: 0 8px 20px rgba(239, 68, 68, 0.5);
}

.bg-transparent {
  background: transparent;
}

.border {
  border-color: rgba(59, 130, 246, 0.3);
}

.text-gray-600 {
  color: #1e40af;
}

.bg-transparent:hover:not(:disabled) {
  background: #eff6ff;
  border-color: rgba(59, 130, 246, 0.3);
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .app-button {
    padding: 0.65rem 1.25rem;
    font-size: 0.95rem;
  }
}
</style>