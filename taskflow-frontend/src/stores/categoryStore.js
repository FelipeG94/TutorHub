import { defineStore } from 'pinia'
import * as categoryService from '@/services/category.service.js'

export const useCategoryStore = defineStore('category', {
  state: () => ({
    categories: [],
    isLoading: false,
    error: null,
  }),

  actions: {
    async fetchCategories() {
      this.isLoading = true
      this.error = null

      try {
        this.categories = await categoryService.getCategories()
      } catch (err) {
        this.error = err.message || 'No se pudieron cargar las categorías.'
      } finally {
        this.isLoading = false
      }
    },

    async createCategory(name) {
      this.isLoading = true
      this.error = null

      try {
        const category = await categoryService.createCategory(name)
        this.categories = [category, ...this.categories].sort((a, b) => a.name.localeCompare(b.name))
        return category
      } catch (err) {
        this.error = err.message || 'No se pudo crear la categoría.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateCategory(id, name) {
      this.isLoading = true
      this.error = null

      try {
        const category = await categoryService.updateCategory(id, name)
        this.categories = this.categories.map((item) => (item.id === category.id ? category : item))
        return category
      } catch (err) {
        this.error = err.message || 'No se pudo actualizar la categoría.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteCategory(id) {
      this.isLoading = true
      this.error = null

      try {
        await categoryService.deleteCategory(id)
        this.categories = this.categories.filter((item) => item.id !== id)
      } catch (err) {
        this.error = err.message || 'No se pudo eliminar la categoría.'
        throw err
      } finally {
        this.isLoading = false
      }
    },
  },
})
