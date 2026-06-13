<script setup>
import { computed } from 'vue'

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  status: {
    type: String,
    default: '',
  },
  categoryId: {
    type: [String, Number],
    default: '',
  },
})

const emit = defineEmits(['update:status', 'update:categoryId', 'clear'])

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'completada', label: 'Completada' },
]

const categoryOptions = computed(() => [
  { value: '', label: 'Todas las categorías' },
  ...props.categories.map((category) => ({
    value: category.id,
    label: category.name,
  })),
])

const handleStatusChange = (event) => {
  emit('update:status', event.target.value)
}

const handleCategoryChange = (event) => {
  emit('update:categoryId', event.target.value)
}

const clearFilters = () => {
  emit('update:status', '')
  emit('update:categoryId', '')
  emit('clear')
}
</script>

<template>
  <section class="task-filters">
    <div class="task-filters__controls">
      <label class="task-filters__field">
        <span>Estado</span>
        <select :value="status" @change="handleStatusChange">
          <option
            v-for="option in statusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>

      <label class="task-filters__field">
        <span>Categoría</span>
        <select :value="categoryId" @change="handleCategoryChange">
          <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <button type="button" class="task-filters__clear" @click="clearFilters">
      Limpiar filtros
    </button>
  </section>
</template>

<style scoped>
.task-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-end;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1rem;
}

.task-filters__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  flex: 1 1 auto;
}

.task-filters__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 12rem;
  font-size: 0.95rem;
  color: #0f172a;
}

.task-filters__field select {
  padding: 0.85rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 0.9rem;
  background: #f8fafc;
  font: inherit;
}

.task-filters__clear {
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #475569;
  padding: 0.85rem 1rem;
  border-radius: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}

.task-filters__clear:hover {
  background: #f1f5f9;
}
</style>
