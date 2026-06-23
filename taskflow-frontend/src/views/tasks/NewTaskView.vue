<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/auth.store'
import TaskForm from '@/components/tasks/TaskForm.vue'

const router = useRouter()
const authStore = useAuthStore()
const taskStore = useTaskStore()
const categoryStore = useCategoryStore()

const categories = computed(() => categoryStore.categories)
const loading = computed(() => taskStore.isLoading || categoryStore.isLoading)

const currentUserId = computed(() => authStore.user?.id)

const handleSubmit = async (payload) => {
  if (!currentUserId.value) return

  await taskStore.createTask({ ...payload, userId: currentUserId.value })
  await router.push('/tareas')
}

const handleCancel = () => {
  router.push('/tareas')
}

onMounted(async () => {
  await categoryStore.fetchCategories()
})
</script>

<template>
  <main class="page-shell">
    <header class="page-header">
      <div>
        <h1>Nueva tarea</h1>
        <p>Completá los datos para agregar una tarea nueva.</p>
      </div>
    </header>

    <TaskForm
      :categories="categories"
      submitLabel="Crear tarea"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </main>
</template>

<style scoped>
.page-shell {
  width: 100%;
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
}

.page-header p {
  margin-top: 0.5rem;
  color: #475569;
}
</style>
