<script setup>
import { computed, onMounted, ref } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'
import { useCategories } from '@/composables/useCategories'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

const categoryStore = useCategoryStore()
const {
  categories,
  newCategoryName,
  editingId,
  editingName,
  handleCreate,
  startEdit,
  confirmEdit,
  cancelEdit,
  handleDelete,
  error
} = useCategories()

const confirmingDeleteId = ref(null)

onMounted(async () => {
  await categoryStore.fetchCategories()
})

const handleDeleteClick = (id) => {
  if (confirmingDeleteId.value === id) {
    handleDelete(id)
    confirmingDeleteId.value = null
  } else {
    confirmingDeleteId.value = id
  }
}

const handleDeleteCancel = () => {
  confirmingDeleteId.value = null
}

</script>



<template>

  <main class="categories-view">

    <header class="categories-header">

      <h1>Gestión de categorías</h1>

    </header>



    <div v-if="error" class="view-alert" role="alert">
      {{ error }}
    </div>

    <section class="add-category-section">

      <div class="add-category-form">

        <AppInput

          v-model="newCategoryName"

          placeholder="Nombre de categoría..."

          class="add-input"

        />

        <AppButton @click="handleCreate" class="add-btn">

          Agregar

        </AppButton>

      </div>

    </section>



    <section class="categories-list-section">

      <h2>Categorías existentes</h2>

      <div class="categories-list">

        <div

          v-for="category in categories"

          :key="category.id"

          class="category-item"

        >

          <div v-if="editingId === category.id" class="edit-mode">

            <AppInput

              v-model="editingName"

              class="edit-input"

            />

            <button @click="confirmEdit" class="btn-confirm">✓</button>

            <button @click="cancelEdit" class="btn-cancel">✗</button>

          </div>

          <div v-else class="view-mode">

            <span class="category-name">{{ category.name }}</span>

            <div class="actions">

              <button @click="startEdit(category)" class="btn-edit">✏️</button>

              <button

                @click="handleDeleteClick(category.id)"

                class="btn-delete"

                :class="{ confirming: confirmingDeleteId === category.id }"

              >

                {{ confirmingDeleteId === category.id ? '¿Confirmar?' : '🗑️' }}

              </button>

              <button

                v-if="confirmingDeleteId === category.id"

                @click="handleDeleteCancel"

                class="btn-cancel-delete"

              >

                  Cancelar

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>

  </main>

</template>

<style scoped>

.categories-view {

  display: flex;

  flex-direction: column;

  gap: 32px;

  padding: 24px;

  max-width: 800px;

  margin: 0 auto;

}



.categories-header {

  text-align: center;

  border-bottom: 2px solid #e5e7eb;

  padding-bottom: 24px;

}



.categories-header h1 {

  margin: 0;

  font-size: 32px;

  color: #1f2937;

}



.add-category-section {

  display: flex;

  flex-direction: column;

  gap: 12px;

}



.add-category-form {

  display: flex;

  gap: 12px;

}



.add-input {

  flex: 1;

}



.add-btn {

  padding: 8px 16px;

}



.categories-list-section {

  display: flex;

  flex-direction: column;

  gap: 16px;

}



.categories-list-section h2 {

  margin: 0;

  font-size: 20px;

  color: #1f2937;

  border-bottom: 1px solid #e5e7eb;

  padding-bottom: 12px;

}



.categories-list {

  display: flex;

  flex-direction: column;

  gap: 12px;

}



.category-item {

  padding: 12px 16px;

  border: 1px solid #e5e7eb;

  border-radius: 6px;

  background: white;

}



.edit-mode {

  display: flex;

  gap: 8px;

  align-items: center;

}



.edit-input {

  flex: 1;

}



.btn-confirm,

.btn-cancel,

.btn-cancel-delete {

  padding: 6px 12px;

  border: none;

  border-radius: 4px;

  cursor: pointer;

  font-size: 14px;

}



.btn-confirm {

  background-color: #10b981;

  color: white;

}



.btn-confirm:hover {

  background-color: #059669;

}



.btn-cancel,

.btn-cancel-delete {

  background-color: #ef4444;

  color: white;

}



.btn-cancel:hover,

.btn-cancel-delete:hover {

  background-color: #dc2626;

}



.view-mode {

  display: flex;

  justify-content: space-between;

  align-items: center;

}



.category-name {

  font-size: 16px;

  color: #1f2937;

  font-weight: 500;

}



.actions {

  display: flex;

  gap: 8px;

}



.btn-edit,

.btn-delete {

  background: none;

  border: none;

  cursor: pointer;

  font-size: 16px;

  padding: 4px 8px;

  border-radius: 4px;

  transition: background-color 0.2s;

}



.btn-edit:hover {

  background-color: #f3f4f6;

}



.btn-delete {

  font-size: 14px;

  padding: 6px 12px;

  background-color: #f3f4f6;

}



.btn-delete:hover {

  background-color: #e5e7eb;

}



.btn-delete.confirming {

  background-color: #fecaca;

  color: #991b1b;

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