<script setup>
const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  categoryName: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['toggle', 'edit', 'delete'])

const handleToggle = () => emit('toggle', props.task.id)
const handleEdit = () => emit('edit', props.task)
const handleDelete = () => emit('delete', props.task.id)

const statusLabel = props.task.status === 'completada' ? 'Completada' : 'Pendiente'
const isCompleted = props.task.status === 'completada'
</script>

<template>
  <article class="task-card" :class="{ 'task-card--done': isCompleted }">
    <div class="task-card__main">
      <div>
        <h3 class="task-card__title">{{ task.title }}</h3>
        <p class="task-card__description">{{ task.description || 'Sin descripción' }}</p>
      </div>

      <div class="task-card__meta">
        <span class="task-card__badge">{{ statusLabel }}</span>
        <span class="task-card__category">{{ categoryName || 'Sin categoría' }}</span>
      </div>
    </div>

    <div class="task-card__footer">
      <div class="task-card__info">
        <small>Creada: {{ new Date(task.created_at).toLocaleDateString() }}</small>
        <small>Usuario: {{ task.user?.email ?? task.user?.role ?? task.user_id ?? 'desconocido' }}</small>
      </div>

      <div class="task-card__actions">
        <button type="button" class="btn-text" @click="handleToggle">
          {{ isCompleted ? 'Marcar pendiente' : 'Marcar completada' }}
        </button>
        <button type="button" class="btn-text" @click="handleEdit">Editar</button>
        <button type="button" class="btn-text btn-danger" @click="handleDelete">Eliminar</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 1.25rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.task-card--done {
  opacity: 0.92;
}

.task-card__main {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.task-card__title {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: #0f172a;
}

.task-card__description {
  margin: 0;
  color: #475569;
}

.task-card__meta {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  align-items: center;
}

.task-card__badge,
.task-card__category {
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.task-card__badge {
  color: #0f172a;
  background: #dbeafe;
}

.task-card__category {
  color: #3730a3;
  background: #ede9fe;
}

.task-card__footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.task-card__info {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  color: #64748b;
}

.task-card__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-text {
  border: none;
  background: transparent;
  color: #2563eb;
  cursor: pointer;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
}

.btn-text:hover {
  background: #eff6ff;
}

.btn-danger {
  color: #dc2626;
}
</style>
