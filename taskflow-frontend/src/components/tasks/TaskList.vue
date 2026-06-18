<script setup>
import { computed } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  tasks: {
    type: Array,
    default: () => [],
  },
  categories: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

const categoryMap = computed(() => {
  return props.categories.reduce((map, category) => {
    map[category.id] = category.name
    return map
  }, {})
})

const taskCount = computed(() => props.tasks.length)
</script>

<template>
  <section class="task-list">
    <div class="task-list__header">
      <h2>Mis tareas</h2>
      <span v-if="loading" class="task-list__status">Cargando...</span>
      <span v-else class="task-list__status">{{ taskCount }} tarea(s)</span>
    </div>

    <div v-if="loading" class="task-list__empty">Cargando tareas...</div>

    <div v-else-if="props.tasks.length === 0" class="task-list__empty">
      No hay tareas disponibles. Creá una tarea para comenzar.
    </div>

    <div v-else class="task-list__grid">
      <TaskCard
        v-for="task in props.tasks"
        :key="task.id"
        :task="task"
        :categoryName="task.category?.name || categoryMap[task.category_id]"
        @toggle="$emit('toggle', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.task-list__header h2 {
  margin: 0;
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
}

.task-list__status {
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 500;
  background: #f0f4f8;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
}

.task-list__empty {
  padding: 3rem 2rem;
  text-align: center;
  color: #64748b;
  border: 2px dashed #cbd5e1;
  border-radius: 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f0f4f8 100%);
  font-size: 1.05rem;
}

.task-list__grid {
  width: 100%;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Responsive breakpoints */
@media (max-width: 1024px) {
  .task-list__grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.25rem;
  }

  .task-list__header h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 768px) {
  .task-list {
    gap: 1.25rem;
  }

  .task-list__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .task-list__header {
    flex-wrap: wrap;
  }

  .task-list__header h2 {
    font-size: 1.25rem;
    width: 100%;
  }

  .task-list__empty {
    padding: 2rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .task-list {
    gap: 1rem;
  }

  .task-list__grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .task-list__header {
    gap: 0.75rem;
  }

  .task-list__header h2 {
    font-size: 1.125rem;
  }

  .task-list__status {
    font-size: 0.8rem;
    padding: 0.35rem 0.65rem;
  }

  .task-list__empty {
    padding: 1.5rem 1rem;
    font-size: 0.95rem;
  }
}
</style>
