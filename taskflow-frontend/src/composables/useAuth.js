import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

export function useAuth() {
	const authStore = useAuthStore()
	const router = useRouter()

	const email = ref('')
	const password = ref('')
	const confirmPassword = ref('')
	const isLoading = ref(false)
	const error = ref('')

	const setError = (message) => {
		error.value = message
		authStore.error = message
	}

	const clearError = () => {
		error.value = ''
		authStore.error = null
	}

	const handleLogin = async () => {
		clearError()

		if (!email.value.trim() || !password.value.trim()) {
			setError('Ingresa ambos campos de email y contraseña.')
			return false
		}

		isLoading.value = true

		try {
			const didLogin = await authStore.login(email.value, password.value)

			if (!didLogin) {
				setError(authStore.error || 'Unable to sign in.')
				return false
			}

			await router.push('/tareas')
			return true
		} catch (caughtError) {
			setError(caughtError?.message || 'Unable to sign in.')
			return false
		} finally {
			isLoading.value = false
		}
	}

	const handleRegister = async () => {
		clearError()

		if (!email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
			setError('Por favor, completa todos los campos.')
			return false
		}

		if (password.value.length < 8) {
			setError('La contraseña debe contener al menos 8 caracteres.')
			return false
		}

		if (password.value !== confirmPassword.value) {
			setError('Las contraseñas no coinciden.')
			return false
		}

		isLoading.value = true

		try {
			const didRegister = await authStore.register(email.value, password.value)

			if (!didRegister) {
				setError(authStore.error || 'Unable to create account.')
				return false
			}

			await router.push('/tareas')
			return true
		} catch (caughtError) {
			setError(caughtError?.message || 'Unable to create account.')
			return false
		} finally {
			isLoading.value = false
		}
	}

	const handleLogout = async () => {
		clearError()
		await authStore.logout()
		await router.push('/login')
	}

	return {
		email,
		password,
		confirmPassword,
		isLoading,
		error,
		handleLogin,
		handleRegister,
		handleLogout,
	}
}
