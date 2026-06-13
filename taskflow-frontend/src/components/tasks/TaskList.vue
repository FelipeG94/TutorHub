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
        :categoryName="categoryMap[task.category_id]"
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
  gap: 1rem;
}

.task-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.task-list__status {
  color: #6b7280;
  font-size: 0.95rem;
}

.task-list__empty {
  padding: 2rem;
  text-align: center;
  color: #475569;
  border: 1px dashed #cbd5e1;
  border-radius: 1rem;
  background: #f8fafc;
}

.task-list__grid {
  display: grid;
  gap: 1rem;
}
</style>
