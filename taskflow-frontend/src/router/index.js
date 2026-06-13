import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const TasksView = () => import('@/views/tasks/TasksView.vue')

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

	if (to.meta.guestOnly && authStore.isAuthenticated) {
		return '/tareas'
	}

	return true
})

export default router
