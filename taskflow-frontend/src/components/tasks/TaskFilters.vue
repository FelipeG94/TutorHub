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
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: flex-end;
  background: #ffffff;
  border: 1px solid rgba(217, 225, 237, 0.6);
  border-radius: 1rem;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
}

.task-filters__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.task-filters__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #0f172a;
}

.task-filters__field span {
  font-weight: 600;
}

.task-filters__field select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(217, 225, 237, 0.7);
  border-radius: 0.75rem;
  background: #f5f7fc;
  font: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.task-filters__field select:hover,
.task-filters__field select:focus {
  border-color: #3b82f6;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.task-filters__clear {
  height: fit-content;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: #eff6ff;
  color: #1e40af;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.task-filters__clear:hover {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1e3a8a;
}

@media (max-width: 768px) {
  .task-filters {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .task-filters__controls {
    grid-template-columns: repeat(2, 1fr);
  }

  .task-filters__clear {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .task-filters {
    padding: 1rem;
  }

  .task-filters__controls {
    grid-template-columns: 1fr;
  }

  .task-filters__field {
    font-size: 0.85rem;
  }

  .task-filters__clear {
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
