import { ref, computed } from 'vue'
import { useTaskStore } from '@/stores/taskStore'

export const useTasks = () => {
  const taskStore = useTaskStore()

  const newTitle = ref('')
  const newDescription = ref('')
  const newCategoryId = ref(null)
  const editingId = ref(null)
  const editingPayload = ref({ title: '', description: '', categoryId: null })

  const tasks = computed(() => taskStore.tasks)
  const allTasks = computed(() => taskStore.allTasks)
  const isLoading = computed(() => taskStore.isLoading)
  const error = computed(() => taskStore.error)

  const fetchTasks = async (userId, filters = {}) => {
    return taskStore.fetchTasks(userId, filters)
  }

  const fetchAllTasks = async (filters = {}) => {
    return taskStore.fetchAllTasks(filters)
  }

  const handleCreate = async (userId) => {
    if (!newTitle.value.trim()) return
    try {
      const payload = {
        title: newTitle.value,
        description: newDescription.value,
        categoryId: newCategoryId.value,
        userId,
      }
      const created = await taskStore.createTask(payload)
      newTitle.value = ''
      newDescription.value = ''
      newCategoryId.value = null
      return created
    } catch (err) {
      console.error('Error creando tarea:', err)
      throw err
    }
  }

  const startEdit = (task) => {
    editingId.value = task.id
    editingPayload.value = {
      title: task.title || '',
      description: task.description || '',
      categoryId: task.category_id || task.categoryId || null,
    }
  }

  const confirmEdit = async () => {
    if (!editingId.value) return
    try {
      const updates = {
        title: editingPayload.value.title,
        description: editingPayload.value.description,
        categoryId: editingPayload.value.categoryId,
      }
      const updated = await taskStore.updateTask(editingId.value, updates)
      editingId.value = null
      editingPayload.value = { title: '', description: '', categoryId: null }
      return updated
    } catch (err) {
      console.error('Error actualizando tarea:', err)
      throw err
    }
  }

  const cancelEdit = () => {
    editingId.value = null
    editingPayload.value = { title: '', description: '', categoryId: null }
  }

  const removeTask = async (id) => {
    try {
      await taskStore.deleteTask(id)
    } catch (err) {
      console.error('Error borrando tarea:', err)
      throw err
    }
  }

  const toggleStatus = async (id) => {
    try {
      await taskStore.toggleStatus(id)
    } catch (err) {
      console.error('Error toggling status:', err)
      throw err
    }
  }

  return {
    tasks,
    allTasks,
    isLoading,
    error,
    newTitle,
    newDescription,
    newCategoryId,
    editingId,
    editingPayload,
    fetchTasks,
    fetchAllTasks,
    handleCreate,
    startEdit,
    confirmEdit,
    cancelEdit,
    removeTask,
    toggleStatus,
  }
}
