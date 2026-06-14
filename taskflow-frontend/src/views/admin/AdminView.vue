<script setup>
import { onMounted, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/auth.store'
import StatsCard from '@/components/common/admin/StatsCard.vue'
import UserProgressBar from '@/components/common/admin/UserProgressBar.vue'
import TasksTable from '@/components/common/admin/TasksTable.vue'

const taskStore = useTaskStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

onMounted(async () => {
  await taskStore.fetchAllTasks()
  await categoryStore.fetchCategories()
})

const totalTasks = computed(() => taskStore.allTasks.length)
const completed = computed(() => taskStore.allTasks.filter((t) => t.status === 'completada').length)
const pending = computed(() => totalTasks.value - completed.value)
const totalCategories = computed(() => categoryStore.categories.length)

const userProgress = computed(() => {
  const grouped = {}

  taskStore.allTasks.forEach((task) => {
    const userKey = task.user_id || 'desconocido'
    const userEmail = task.user?.email ?? task.user_id ?? 'desconocido'

    if (!grouped[userKey]) {
      grouped[userKey] = {
        user_id: userKey,
        email: userEmail,
        total: 0,
        completed: 0,
      }
    }

    grouped[userKey].total++

    if (task.status === 'completada') {
      grouped[userKey].completed++
    }
  })

  return Object.values(grouped)
})
</script>

<template>
  <main class="admin-view">
    <header class="admin-header">
      <h1>Panel de administración</h1>
      <p>Estadísticas globales y gestión del sistema</p>
    </header>

    <section class="stats-section">
      <h2>Statistics</h2>
      <div class="stats-grid">
        <StatsCard
          title="Total Tasks"
          :value="totalTasks"
          icon="📋"
          colorClass="blue"
        />
        <StatsCard
          title="Completed"
          :value="completed"
          icon="✅"
          colorClass="green"
        />
        <StatsCard
          title="Pending"
          :value="pending"
          icon="⏳"
          colorClass="yellow"
        />
        <StatsCard
          title="Categories"
          :value="totalCategories"
          icon="🏷️"
          colorClass="purple"
        />
      </div>
    </section>

    <section class="progress-section">
      <h2>User Progress</h2>
      <div class="progress-list">
        <UserProgressBar
          v-for="user in userProgress"
          :key="user.user_id"
          :email="user.email"
          :total="user.total"
          :completed="user.completed"
        />
      </div>
    </section>

    <section class="tasks-section">
      <h2>Todas las tareas</h2>
      <TasksTable
        :tasks="taskStore.allTasks"
        @delete-task="taskStore.deleteTask"
      />
    </section>
  </main>
</template>

<style scoped>
.admin-view {
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header {
  text-align: center;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 24px;
}

.admin-header h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  color: #1f2937;
}

.admin-header p {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
}

.stats-section,
.progress-section,
.tasks-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-section h2,
.progress-section h2,
.tasks-section h2 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.progress-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
