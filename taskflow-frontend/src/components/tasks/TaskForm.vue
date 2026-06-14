<script setup>
import { computed, ref, watch } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'

const props = defineProps({
  task: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  submitLabel: {
    type: String,
    default: 'Guardar tarea',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const title = ref(props.task?.title ?? '')
const description = ref(props.task?.description ?? '')
const categoryId = ref(props.task?.category_id ?? '')
const titleError = ref('')

watch(
  () => props.task,
  (nextTask) => {
    title.value = nextTask?.title ?? ''
    description.value = nextTask?.description ?? ''
    categoryId.value = nextTask?.category_id ?? ''
    titleError.value = ''
  },
  { immediate: true },
)

const categoryOptions = computed(() => [
  { value: '', label: 'Sin categoría' },
  ...props.categories.map((category) => ({ value: category.id, label: category.name })),
])

const handleSubmit = async () => {
  titleError.value = ''

  if (!title.value.trim()) {
    titleError.value = 'El título es obligatorio.'
    return
  }

  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    categoryId: categoryId.value || null,
  })
}

const handleCancel = () => emit('cancel')
</script>

<template>
  <form class="task-form" @submit.prevent="handleSubmit">
    <AppInput
      v-model="title"
      label="Título"
      placeholder="Escribe el título de la tarea"
      :error="titleError"
      required
    />

    <AppInput
      v-model="description"
      label="Descripción"
      type="text"
      placeholder="Describe brevemente la tarea"
    />

    <AppSelect
      v-model="categoryId"
      :options="categoryOptions"
      placeholder="Seleccionar categoría"
    />

    <div class="task-form__actions">
      <AppButton type="submit" :loading="loading" :disabled="loading">
        {{ submitLabel }}
      </AppButton>
      <AppButton type="button" variant="ghost" @click="handleCancel">
        Cancelar
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  display: grid;
  gap: 1rem;
}

.task-form__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-end;
}
</style>
