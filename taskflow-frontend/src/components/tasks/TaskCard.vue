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
    <!-- Status indicator bar -->
    <div class="task-card__status-bar" :class="isCompleted ? 'completed' : 'pending'"></div>

    <!-- Content -->
    <div class="task-card__content">
      <div class="task-card__header">
        <h3 class="task-card__title">{{ task.title }}</h3>
        <span class="task-card__badge" :class="isCompleted ? 'badge-success' : 'badge-warning'">
          {{ statusLabel }}
        </span>
      </div>

      <p class="task-card__description">{{ task.description || 'Sin descripción' }}</p>

      <!-- Category badge -->
      <div class="task-card__category-bar">
        <span class="task-card__category">{{ categoryName || 'Sin categoría' }}</span>
      </div>

      <!-- Meta info -->
      <div class="task-card__meta">
        <span class="task-card__date">{{ new Date(task.created_at).toLocaleDateString('es-AR') }}</span>
      </div>
    </div>

    <!-- Actions -->
    <div class="task-card__actions">
      <button type="button" class="btn-action" :title="isCompleted ? 'Marcar pendiente' : 'Marcar completada'" @click="handleToggle">
        <span class="btn-icon">✓</span>
      </button>
      <button type="button" class="btn-action" title="Editar" @click="handleEdit">
        <span class="btn-icon">✎</span>
      </button>
      <button
        type="button"
        class="btn-action btn-action-danger"
        title="Eliminar"
        @click="handleDelete"
      >
        <span class="btn-icon">×</span>
      </button>
    </div>
  </article>
</template>

<style scoped>
.task-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  border: 1px solid rgba(217, 225, 237, 0.7);
  border-radius: 0.875rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
  min-height: 260px;
  position: relative;
}

.task-card:hover {
  box-shadow: 0 12px 24px rgba(59, 130, 246, 0.15);
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.3);
}

.task-card--done {
  opacity: 0.75;
}

.task-card--done .task-card__title {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-card--done .task-card__description {
  color: #cbd5e1;
}

/* Status bar */
.task-card__status-bar {
  height: 5px;
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
  transition: background 0.3s ease;
}

.task-card__status-bar.completed {
  background: linear-gradient(90deg, #10b981, #6ee7b7);
}

/* Main content area */
.task-card__content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.task-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
}

.task-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0a0e27;
  line-height: 1.4;
  word-break: break-word;
  flex: 1;
  transition: color 0.3s ease;
}

.task-card__badge {
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}

.task-card__badge.badge-warning {
  background: #fef08a;
  color: #7c2d12;
}

.task-card__badge.badge-success {
  background: #86efac;
  color: #064e3b;
}

.task-card__description {
  margin: 0;
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  word-break: break-word;
  transition: color 0.3s ease;
}

.task-card__category-bar {
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
}

.task-card__category {
  display: inline-block;
  padding: 0.35rem 0.65rem;
  background: #eff6ff;
  color: #1e40af;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.task-card__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f1f5f9;
}

.task-card__date {
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Actions */
.task-card__actions {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #f5f7fc;
  border-top: 1px solid rgba(217, 225, 237, 0.5);
  justify-content: flex-end;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 0.5rem;
  background: #dbeafe;
  color: #1e40af;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
  flex-shrink: 0;
}

.btn-action:hover {
  background: #93c5fd;
  color: #0c4a6e;
  transform: scale(1.05);
}

.btn-action:active {
  transform: scale(0.95);
}

.btn-action-danger {
  background: #fecaca;
  color: #991b1b;
}

.btn-action-danger:hover {
  background: #fca5a5;
  color: #7f1d1d;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
