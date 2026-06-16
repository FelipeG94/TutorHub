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
const handleDelete = async (id) => {
  await taskStore.deleteTask(id)
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
      @delete="handleDelete"
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
  </main>
</template>

<style scoped>
.page-shell {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
}

.page-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.page-shell h1 {
  margin: 0;
  font-size: 2rem;
}

.page-shell p {
  margin: 0.5rem 0 0;
  color: #475569;
}

.view-alert {
  margin: 1rem 0;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid rgba(220, 38, 38, 0.25);
  background: rgba(254, 226, 226, 0.75);
  color: #991b1b;
}
</style>
