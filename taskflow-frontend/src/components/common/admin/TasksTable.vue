<template>
  <div class="tasks-table-container">
    <div class="filters">
      <input
        v-model="filterUser"
        type="text"
        placeholder="Search by email..."
        class="filter-input"
      />
      <select v-model="filterStatus" class="filter-select">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <table class="tasks-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Category</th>
          <th>Status</th>
          <th>User</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in paginatedTasks" :key="task.id">
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.category }}</td>
          <td><AppBadge :status="task.status" /></td>
          <td>{{ task.user.email }}</td>
          <td>{{ formatDate(task.date) }}</td>
          <td>
            <button @click="deleteTask(task.id)" class="btn-delete">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="tasksFiltered.length > 10" class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 0"
        class="btn-pagination"
      >
        Previous
      </button>
      <span class="page-info">Page {{ currentPage + 1 }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages - 1"
        class="btn-pagination"
      >
        Next
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
    required: true
  }
})

const emit = defineEmits(['delete-task'])

const filterUser = ref('')
const filterStatus = ref('')
const currentPage = ref(0)

const tasksFiltered = computed(() => {
  return props.tasks.filter(task => {
    const matchesUser = task.user.email
      .toLowerCase()
      .includes(filterUser.value.toLowerCase())
    const matchesStatus = filterStatus.value === '' || task.status === filterStatus.value
    return matchesUser && matchesStatus
  })
})

const itemsPerPage = 10
const totalPages = computed(() => Math.ceil(tasksFiltered.value.length / itemsPerPage))

const paginatedTasks = computed(() => {
  const start = currentPage.value * itemsPerPage
  const end = start + itemsPerPage
  return tasksFiltered.value.slice(start, end)
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
