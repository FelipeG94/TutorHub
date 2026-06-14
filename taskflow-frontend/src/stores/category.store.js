import { defineStore } from 'pinia';
import * as categoryService from '../services/category.service';

export const useCategoryStore = defineStore('category', {
  state() {
    return {
      categories: [],
      isLoading: false,
      error: null,
    };
  },

  actions: {
    /**
     * Fetches all categories from the service
     * Called when any component using categories is mounted
     */
    async fetchCategories() {
      this.isLoading = true;
      this.error = null;
      try {
        this.categories = await categoryService.getCategories();
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Creates a new category
     * @param {string} name - Category name
     */
    async createCategory(name) {
      // Validate that name is not empty
      if (!name.trim()) {
        this.error = 'Category name cannot be empty';
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        const newCategory = await categoryService.createCategory(name);
        this.categories.push(newCategory);
        // Sort by name alphabetically
        this.categories.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        // Handle duplicate category error (UNIQUE constraint violation - code 23505)
        if (err.code === '23505' || err.message.includes('unique')) {
          this.error = 'A category with that name already exists';
        } else {
          this.error = err.message;
        }
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Updates an existing category
     * @param {number} id - Category ID
     * @param {string} name - New category name
     */
    async updateCategory(id, name) {
      this.isLoading = true;
      this.error = null;
      try {
        const updatedCategory = await categoryService.updateCategory(id, name);
        // Update in local array
        this.categories = this.categories.map(cat =>
          cat.id === id ? updatedCategory : cat
        );
        // Sort by name alphabetically
        this.categories.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * Deletes a category
     * @param {number} id - Category ID
     */
    async deleteCategory(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await categoryService.deleteCategory(id);
        // Filter from local array on success
        this.categories = this.categories.filter(cat => cat.id !== id);
      } catch (err) {
        // Set error message from service (e.g., "No se puede eliminar: tiene tareas asociadas")
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
