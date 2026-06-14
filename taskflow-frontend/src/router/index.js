import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const TasksView = () => import('@/views/tasks/TasksView.vue')
const NewTaskView = () => import('@/views/tasks/NewTaskView.vue')
const AdminView = () => import('@/views/admin/AdminView.vue')
const CategoriesView = () => import('@/views/admin/CategoriesView.vue')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/tareas',
      name: 'tasks',
      component: TasksView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tareas/nueva',
      name: 'new-task',
      component: NewTaskView,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/admin/categorias',
      name: 'admin-categories',
      component: CategoriesView,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach(async (to) => {
	const authStore = useAuthStore()

	if (!authStore.user) {
		await authStore.checkSession()
	}

	if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		return '/login'
	}

	if (to.meta.requiresAdmin && !authStore.isAdmin) {
		return '/tareas'
	}

	if (to.meta.guestOnly && authStore.isAuthenticated) {
		return '/tareas'
	}

	return true
})

export default router
