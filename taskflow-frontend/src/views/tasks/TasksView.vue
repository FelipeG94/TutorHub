<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/auth.store'
import TaskFilters from '@/components/tasks/TaskFilters.vue'
import TaskList from '@/components/tasks/TaskList.vue'
import TaskForm from '@/components/tasks/TaskForm.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const taskError = computed(() => taskStore.error)
const categoryError = computed(() => categoryStore.error)

const isModalOpen = ref(false)
const selectedTask = ref(null)
const statusFilter = ref('')
const categoryFilter = ref('')

const currentUserId = computed(() => authStore.user?.id)

const filteredTasks = computed(() => {
  return taskStore.tasks.filter((task) => {
    const matchesStatus = statusFilter.value === '' || task.status === statusFilter.value
    const matchesCategory =
      categoryFilter.value === '' || String(task.category_id) === String(categoryFilter.value)
    return matchesStatus && matchesCategory
  })
})

const loadData = async () => {
  if (!currentUserId.value) return

  await categoryStore.fetchCategories()
  await taskStore.fetchTasks(currentUserId.value)
}

watch(
  () => currentUserId.value,
  async (userId) => {
    if (userId) {
      await loadData()
    }
  }
)

const openModal = (task = null) => {
  selectedTask.value = task
  isModalOpen.value = true
}

const closeModal = () => {
  selectedTask.value = null
  isModalOpen.value = false
}

const handleSubmit = async (payload) => {
  if (!currentUserId.value) {
    return
  }

  try {
    if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, payload)
    } else {
      await taskStore.createTask({ ...payload, userId: currentUserId.value })
    }

    closeModal()
  } catch (error) {
    console.error(error)
  }
}

const handleEdit = (task) => openModal(task)

const isDeleteModalOpen = ref(false)
const taskToDelete = ref(null)

const handleDeleteClick = (taskId) => {
  taskToDelete.value = taskId
  isDeleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!taskToDelete.value) return

  try {
    await taskStore.deleteTask(taskToDelete.value)
  } catch (err) {
    console.error(err)
  } finally {
    isDeleteModalOpen.value = false
    taskToDelete.value = null
  }
}

const cancelDelete = () => {
  isDeleteModalOpen.value = false
  taskToDelete.value = null
}

const handleToggle = async (id) => {
  await taskStore.toggleStatus(id)
}
const handleClearFilters = () => {
  statusFilter.value = ''
  categoryFilter.value = ''
}
const navigateToNewTask = () => {
  router.push('/tareas/nueva')
}

onMounted(loadData)
</script>

<template>
  <main class="page-shell">
    <header class="page-header">
      <div>
        <h1>Tareas</h1>
        <p>Organizá tus tareas y mantené el flujo de trabajo bajo control.</p>
      </div>

      <div class="page-actions">
        <AppButton @click="openModal()">Crear tarea rápida</AppButton>
      </div>
    </header>

    <div v-if="taskError || categoryError" class="view-alert" role="alert">
      {{ taskError || categoryError }}
    </div>

    <TaskFilters
      :categories="categoryStore.categories"
      :status="statusFilter"
      :categoryId="categoryFilter"
      @update:status="statusFilter = $event"
      @update:categoryId="categoryFilter = $event"
      @clear="handleClearFilters"
    />

    <TaskList
      :tasks="filteredTasks"
      :categories="categoryStore.categories"
      :loading="taskStore.isLoading || categoryStore.isLoading"
      @toggle="handleToggle"
      @edit="handleEdit"
      @delete="handleDeleteClick"
    />

    <AppModal :isOpen="isModalOpen" :title="selectedTask ? 'Editar tarea' : 'Nueva tarea'" @close="closeModal">
      <TaskForm
        :task="selectedTask"
        :categories="categoryStore.categories"
        :submitLabel="selectedTask ? 'Actualizar tarea' : 'Crear tarea'"
        :loading="taskStore.isLoading"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </AppModal>

    <AppModal :isOpen="isDeleteModalOpen" title="Confirmar eliminación" @close="cancelDelete">
      <div class="delete-confirmation">
        <p>¿Estás seguro de que querés eliminar esta tarea?</p>
        <p class="delete-confirmation__warning">Esta acción no se puede deshacer.</p>
        <div class="delete-confirmation__actions">
          <AppButton variant="secondary" @click="cancelDelete">Cancelar</AppButton>
          <AppButton variant="danger" @click="confirmDelete" :loading="taskStore.isLoading">Eliminar</AppButton>
        </div>
      </div>
    </AppModal>
  </main>
</template>

<style scoped>
.page-shell {
  width: 100%;
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 640px) {
  .page-shell {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .page-shell {
    padding: 2.5rem;
  }
}

.page-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: start;
  width: 100%;
}

.page-header > div {
  min-width: 0;
}

.page-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

@media (max-width: 640px) {
  .page-header {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .page-actions {
    width: 100%;
    justify-content: stretch;
  }

  .page-actions :deep(button) {
    flex: 1;
  }
}

.page-shell h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .page-shell h1 {
    font-size: 2rem;
  }
}

@media (min-width: 1024px) {
  .page-shell h1 {
    font-size: 2.5rem;
  }
}

.page-shell p {
  margin: 0.5rem 0 0;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

@media (min-width: 640px) {
  .page-shell p {
    font-size: 1rem;
  }
}

.view-alert {
  margin: 0;
  padding: 1rem 1.25rem;
  border-radius: 0.875rem;
  border: 1px solid #fca5a5;
  background: #fee2e2;
  color: #7f1d1d;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.delete-confirmation {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.delete-confirmation p {
  margin: 0;
  color: #334155;
  font-size: 0.95rem;
  line-height: 1.5;
}

.delete-confirmation__warning {
  color: #ea580c;
  font-size: 0.85rem;
  font-weight: 500;
}

.delete-confirmation__actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

</style>
