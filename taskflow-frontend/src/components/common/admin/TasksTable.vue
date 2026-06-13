<template>
  <div class="tasks-table-container">
    <div class="filters">
      <input
        v-model="filterUser"
        type="text"
        placeholder="Buscar por usuario..."
        class="filter-input"
      />
      <select v-model="filterStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="pendiente">Pendiente</option>
        <option value="completada">Completada</option>
      </select>
    </div>

    <table class="tasks-table">
      <thead>
        <tr>
          <th>Título</th>
          <th>Descripción</th>
          <th>Categoría</th>
          <th>Estado</th>
          <th>Usuario</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in paginatedTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description || 'Sin descripción' }}</td>
          <td>{{ task.category || task.category_id || 'Sin categoría' }}</td>
          <td>
            <AppBadge :text="statusLabel(task.status)" :variant="statusVariant(task.status)" />
          </td>
          <td>{{ task.user?.email ?? task.user_id ?? 'desconocido' }}</td>
          <td>{{ formatDate(task.created_at || task.date) }}</td>
          <td>
            <button @click="deleteTask(task.id)" class="btn-delete">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="tasksFiltered.length > itemsPerPage" class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 0"
        class="btn-pagination"
      >
        Anterior
      </button>
      <span class="page-info">Página {{ currentPage + 1 }} de {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages - 1"
        class="btn-pagination"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppBadge from '@/components/common/AppBadge.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['delete-task'])

const filterUser = ref('')
const filterStatus = ref('')
const currentPage = ref(0)
const itemsPerPage = 10

const tasksFiltered = computed(() => {
  return props.tasks.filter((task) => {
    const userLabel = (task.user?.email || task.user_id || '').toLowerCase()
    const matchesUser = userLabel.includes(filterUser.value.toLowerCase())
    const matchesStatus = filterStatus.value === '' || task.status === filterStatus.value
    return matchesUser && matchesStatus
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(tasksFiltered.value.length / itemsPerPage)))

const paginatedTasks = computed(() => {
  const start = currentPage.value * itemsPerPage
  return tasksFiltered.value.slice(start, start + itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const deleteTask = (id) => {
  emit('delete-task', id)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const statusLabel = (status) => {
  if (status === 'completada') return 'Completada'
  return 'Pendiente'
}

const statusVariant = (status) => {
  return status === 'completada' ? 'success' : 'warning'
}
</script>

<style scoped>
.tasks-table-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-input,
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.filter-input {
  flex: 1;
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tasks-table thead {
  background-color: #f5f5f5;
}

.tasks-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.tasks-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}

.tasks-table tbody tr:hover {
  background-color: #f9f9f9;
}

.btn-delete {
  background-color: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
}

.btn-pagination {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-pagination:hover:not(:disabled) {
  background-color: #f5f5f5;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}
</style>
