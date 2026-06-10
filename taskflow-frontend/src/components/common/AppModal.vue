<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close'])

const titleId = `app-modal-title-${Math.random().toString(36).slice(2, 10)}`
const hasTitle = computed(() => Boolean(props.title))

const lockBodyScroll = (shouldLock) => {
  if (typeof document === 'undefined') {
    return
  }

  document.body.style.overflow = shouldLock ? 'hidden' : ''
}

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = (event) => {
  if (event.target === event.currentTarget) {
    handleClose()
  }
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    lockBodyScroll(isOpen)

    if (typeof window !== 'undefined') {
      if (isOpen) {
        window.addEventListener('keydown', handleKeydown)
      } else {
        window.removeEventListener('keydown', handleKeydown)
      }
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  lockBodyScroll(false)

  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="handleOverlayClick">
      <div
        class="modal-dialog"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="hasTitle ? titleId : undefined"
      >
        <header class="modal-header">
          <h2 v-if="hasTitle" :id="titleId" class="modal-title">
            {{ title }}
          </h2>
          <button type="button" class="modal-close" aria-label="Cerrar modal" @click="handleClose">
            ×
          </button>
        </header>

        <section class="modal-body">
          <slot />
        </section>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 1.25rem;
  background: rgba(15, 23, 42, 0.58);
}

.modal-dialog {
  width: min(100%, 42rem);
  max-height: calc(100vh - 2.5rem);
  overflow: auto;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow:
    rgba(15, 23, 42, 0.2) 0 18px 50px -10px,
    rgba(15, 23, 42, 0.1) 0 8px 24px -12px;
}

.modal-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.25rem 0.75rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.modal-title {
  margin: 0;
  font-size: 1.125rem;
  line-height: 1.25;
  color: #0f172a;
}

.modal-close {
  flex: 0 0 auto;
  width: 2.25rem;
  height: 2.25rem;
  border: 0;
  border-radius: 999px;
  background: #f1f5f9;
  color: #0f172a;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}

.modal-body {
  padding: 1.25rem;
}

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>