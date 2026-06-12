import { defineStore } from 'pinia'

const STORAGE_KEYS = {
	users: 'taskflow.auth.users',
	session: 'taskflow.auth.session',
}

const authListeners = new Set()
let storageListenerInstalled = false

const safeRead = (key, fallback) => {
	if (typeof window === 'undefined') {
		return fallback
	}

	try {
		const rawValue = window.localStorage.getItem(key)
		return rawValue ? JSON.parse(rawValue) : fallback
	} catch {
		return fallback
	}
}

const safeWrite = (key, value) => {
	if (typeof window === 'undefined') {
		return
	}

	window.localStorage.setItem(key, JSON.stringify(value))
}

const safeRemove = (key) => {
	if (typeof window === 'undefined') {
		return
	}

	window.localStorage.removeItem(key)
}

const cloneUser = (user) => (user ? { id: user.id, email: user.email, role: user.role } : null)

const getStoredUsers = () => safeRead(STORAGE_KEYS.users, [])
const setStoredUsers = (users) => safeWrite(STORAGE_KEYS.users, users)
const getStoredSession = () => safeRead(STORAGE_KEYS.session, null)
const setStoredSession = (user) => safeWrite(STORAGE_KEYS.session, user)
const clearStoredSession = () => safeRemove(STORAGE_KEYS.session)

const emitAuthStateChange = (sessionUser) => {
	for (const listener of authListeners) {
		listener('TOKEN_CHANGED', sessionUser ? { user: cloneUser(sessionUser) } : null)
	}
}

const authService = {
	async getSession() {
		const sessionUser = getStoredSession()

		return {
			data: {
				session: sessionUser ? { user: cloneUser(sessionUser) } : null,
			},
			error: null,
		}
	},

	async signIn(email, password) {
		const users = getStoredUsers()
		const user = users.find((entry) => entry.email === email && entry.password === password)

		if (!user) {
			return {
				data: { user: null },
				error: { message: 'Invalid email or password.' },
			}
		}

		const sessionUser = cloneUser(user)
		setStoredSession(sessionUser)
		emitAuthStateChange(sessionUser)

		return {
			data: { user: sessionUser },
			error: null,
		}
	},

	async signUp(email, password) {
		const users = getStoredUsers()
		const existingUser = users.find((entry) => entry.email === email)

		if (existingUser) {
			return {
				data: { user: null },
				error: { message: 'An account with this email already exists.' },
			}
		}

		const sessionUser = {
			id: crypto.randomUUID(),
			email,
			password,
			role: 'lector',
		}

		setStoredUsers([...users, sessionUser])
		setStoredSession(sessionUser)
		emitAuthStateChange(sessionUser)

		return {
			data: { user: cloneUser(sessionUser) },
			error: null,
		}
	},

	async signOut() {
		clearStoredSession()
		emitAuthStateChange(null)

		return {
			error: null,
		}
	},

	async fetchProfile(userId) {
		const users = getStoredUsers()
		const user = users.find((entry) => entry.id === userId)

		if (!user) {
			return {
				data: { profile: null },
				error: { message: 'Profile not found.' },
			}
		}

		return {
			data: {
				profile: {
					role: user.role,
				},
			},
			error: null,
		}
	},

	onAuthStateChange(callback) {
		authListeners.add(callback)

		if (!storageListenerInstalled && typeof window !== 'undefined') {
			storageListenerInstalled = true
			window.addEventListener('storage', (event) => {
				if (event.key === STORAGE_KEYS.session) {
					const sessionUser = getStoredSession()
					emitAuthStateChange(sessionUser)
				}
			})
		}

		return {
			data: {
				subscription: {
					unsubscribe() {
						authListeners.delete(callback)
					},
				},
			},
		}
	},
}

const normalizeError = (error) => {
	if (!error) {
		return null
	}

	if (typeof error === 'string') {
		return error
	}

	return error.message ?? 'Something went wrong.'
}

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		isLoading: false,
		error: null,
	}),

	getters: {
		isAuthenticated: (state) => Boolean(state.user),
		isAdmin: (state) => state.user?.role === 'admin',
	},

	actions: {
		async checkSession() {
			const { data, error } = await authService.getSession()

			if (error) {
				this.error = normalizeError(error)
				return null
			}

			const sessionUser = data?.session?.user ?? null

			if (!sessionUser) {
				this.user = null
				if (!this._authStateSubscription) {
					this._authStateSubscription = authService.onAuthStateChange(async (_event, session) => {
						const nextUser = session?.user ?? null

						if (!nextUser) {
							this.user = null
							this.error = null
							return
						}

						this.user = cloneUser(nextUser)
						await this.fetchProfile(nextUser.id)
					})
				}
				return null
			}

			this.user = cloneUser(sessionUser)

			if (!this._authStateSubscription) {
				this._authStateSubscription = authService.onAuthStateChange(async (_event, session) => {
					const nextUser = session?.user ?? null

					if (!nextUser) {
						this.user = null
						this.error = null
						return
					}

					this.user = cloneUser(nextUser)
					await this.fetchProfile(nextUser.id)
				})
			}

			await this.fetchProfile(sessionUser.id)
			return this.user
		},

		async login(email, pass) {
			this.isLoading = true
			this.error = null

			try {
				const { data, error } = await authService.signIn(email, pass)

				if (error) {
					this.error = normalizeError(error)
					return false
				}

				this.user = cloneUser(data.user)
				await this.fetchProfile(data.user.id)
				return true
			} catch (caughtError) {
				this.error = normalizeError(caughtError)
				return false
			} finally {
				this.isLoading = false
			}
		},

		async register(email, pass) {
			this.isLoading = true
			this.error = null

			try {
				const { data, error } = await authService.signUp(email, pass)

				if (error) {
					this.error = normalizeError(error)
					return false
				}

				this.user = {
					...cloneUser(data.user),
					role: 'lector',
				}
				return true
			} catch (caughtError) {
				this.error = normalizeError(caughtError)
				return false
			} finally {
				this.isLoading = false
			}
		},

		async logout() {
			await authService.signOut()
			this.user = null
			this.error = null
		},

		async fetchProfile(userId) {
			const { data, error } = await authService.fetchProfile(userId)

			if (error) {
				this.error = normalizeError(error)
				return null
			}

			if (data?.profile?.role) {
				this.user = {
					...this.user,
					role: data.profile.role,
				}
			}

			return this.user
		},
	},
})
