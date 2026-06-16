import { ref, computed } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'

export const useCategories = () => {
  const categoryStore = useCategoryStore()

  const newCategoryName = ref('')
  const editingId = ref(null)
  const editingName = ref('')

  const categories = computed(() => categoryStore.categories)
  const isLoading = computed(() => categoryStore.isLoading)
  const error = computed(() => categoryStore.error)

  const handleCreate = async () => {
    if (!newCategoryName.value.trim()) {
      return
    }
    try {
      await categoryStore.createCategory(newCategoryName.value)
      newCategoryName.value = ''
    } catch (err) {
      console.error('Error creando categoria:', err)
    }
  }

  const startEdit = (cat) => {
    editingId.value = cat.id
    editingName.value = cat.name
  }

  const confirmEdit = async () => {
    if (!editingName.value.trim()) {
      return
    }
    try {
      await categoryStore.updateCategory(editingId.value, editingName.value)
      editingId.value = null
      editingName.value = ''
    } catch (err) {
      console.error('Error actualizando categoria:', err)
    }
  }

  const cancelEdit = () => {
    editingId.value = null
    editingName.value = ''
  }

  const handleDelete = async (id) => {
    try {
      await categoryStore.deleteCategory(id)
    } catch (err) {
      console.error('Error borrando categoria:', err)
    }
  }

  return {
    categories,
    isLoading,
    error,
    newCategoryName,
    editingId,
    editingName,
    handleCreate,
    startEdit,
    confirmEdit,
    cancelEdit,
    handleDelete
  }
}
