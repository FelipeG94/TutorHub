import { defineStore } from 'pinia'
import { fetchProfile, getSession, onAuthStateChange, signIn, signOut, signUp } from '@/services/auth.service'

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
			const { data, error } = await getSession()

			if (error) {
				this.error = normalizeError(error)
				return null
			}

			const sessionUser = data?.session?.user ?? null

			if (!sessionUser) {
				this.user = null
				if (!this._authStateSubscription) {
					this._authStateSubscription = onAuthStateChange(async (_event, session) => {
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
				this._authStateSubscription = onAuthStateChange(async (_event, session) => {
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
				const { data, error } = await signIn(email, pass)

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
				const { data, error } = await signUp(email, pass)

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
			await signOut()
			this.user = null
			this.error = null
		},

		async fetchProfile(userId) {
			const { data, error } = await fetchProfile(userId)

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
