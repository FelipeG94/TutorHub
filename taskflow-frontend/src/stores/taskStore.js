import { defineStore } from 'pinia'
import * as taskService from '@/services/task.service.js'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [],
    allTasks: [],
    isLoading: false,
    error: null,
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter((task) => task.status === 'pendiente'),
    completedTasks: (state) => state.tasks.filter((task) => task.status === 'completada'),
  },

  actions: {
    async fetchTasks(userId, filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        this.tasks = await taskService.getTasks(userId, filters)
      } catch (err) {
        this.error = err.message || 'No se pudieron cargar las tareas.'
      } finally {
        this.isLoading = false
      }
    },

    async fetchAllTasks(filters = {}) {
      this.isLoading = true
      this.error = null

      try {
        this.allTasks = await taskService.getAllTasks(filters)
      } catch (err) {
        this.error = err.message || 'No se pudieron cargar las tareas.'
      } finally {
        this.isLoading = false
      }
    },

    async createTask(payload) {
      this.isLoading = true
      this.error = null

      try {
        const task = await taskService.createTask(payload)
        this.tasks.unshift(task)
        return task
      } catch (err) {
        this.error = err.message || 'No se pudo crear la tarea.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async updateTask(id, payload) {
      this.isLoading = true
      this.error = null

      try {
        const updated = await taskService.updateTask(id, payload)
        this.tasks = this.tasks.map((task) => (task.id === updated.id ? updated : task))
        this.allTasks = this.allTasks.map((task) => (task.id === updated.id ? updated : task))
        return updated
      } catch (err) {
        this.error = err.message || 'No se pudo actualizar la tarea.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async deleteTask(id) {
      this.isLoading = true
      this.error = null

      try {
        await taskService.deleteTask(id)
        this.tasks = this.tasks.filter((task) => task.id !== id)
        this.allTasks = this.allTasks.filter((task) => task.id !== id)
      } catch (err) {
        this.error = err.message || 'No se pudo eliminar la tarea.'
        throw err
      } finally {
        this.isLoading = false
      }
    },

    async toggleStatus(id) {
      const existing = this.tasks.find((task) => task.id === id) || this.allTasks.find((task) => task.id === id)
      if (!existing) {
        this.error = 'Tarea no encontrada.'
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const updated = await taskService.toggleTaskStatus(id, existing.status)
        this.tasks = this.tasks.map((task) => (task.id === updated.id ? updated : task))
        this.allTasks = this.allTasks.map((task) => (task.id === updated.id ? updated : task))
      } catch (err) {
        this.error = err.message || 'No se pudo cambiar el estado.'
      } finally {
        this.isLoading = false
      }
    },
  },
})
