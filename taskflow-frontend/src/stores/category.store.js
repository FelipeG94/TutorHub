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

   
    async createCategory(name) {
     
      if (!name.trim()) {
        this.error = 'Category name cannot be empty';
        return;
      }

      this.isLoading = true;
      this.error = null;
      try {
        const newCategory = await categoryService.createCategory(name);
        this.categories.push(newCategory);
       
        this.categories.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
       
        if (err.code === '23505' || err.message.includes('unique')) {
          this.error = 'A category with that name already exists';
        } else {
          this.error = err.message;
        }
      } finally {
        this.isLoading = false;
      }
    },


    async updateCategory(id, name) {
      this.isLoading = true;
      this.error = null;
      try {
        const updatedCategory = await categoryService.updateCategory(id, name);
      
        this.categories = this.categories.map(cat =>
          cat.id === id ? updatedCategory : cat
        );
    
        this.categories.sort((a, b) => a.name.localeCompare(b.name));
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },

  
    async deleteCategory(id) {
      this.isLoading = true;
      this.error = null;
      try {
        await categoryService.deleteCategory(id);
     
        this.categories = this.categories.filter(cat => cat.id !== id);
      } catch (err) {
       
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
