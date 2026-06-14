import { supabase } from './supabaseClient'

export const signIn = async (email, password) => {
	const { data, error } = await supabase.auth.signInWithPassword({ email, password })

	return {
		data: {
			user: data?.user ?? null,
			session: data?.session ?? null,
		},
		error,
	}
}

export const signUp = async (email, password) => {
	const signUpResult = await supabase.auth.signUp({ email, password })

	if (signUpResult.error) {
		return {
			data: {
				user: signUpResult.data?.user ?? null,
				session: signUpResult.data?.session ?? null,
			},
			error: signUpResult.error,
		}
	}

	const user = signUpResult.data?.user ?? null

	if (!user) {
		return {
			data: {
				user: null,
				session: signUpResult.data?.session ?? null,
			},
			error: { message: 'Unable to create user account.' },
		}
	}

	const profileResult = await supabase.from('profiles').insert({
		id: user.id,
		role: 'lector',
	})

	if (profileResult.error) {
		return {
			data: {
				user,
				session: signUpResult.data?.session ?? null,
			},
			error: profileResult.error,
		}
	}

	return {
		data: {
			user,
			session: signUpResult.data?.session ?? null,
		},
		error: null,
	}
}

export const signOut = async () => {
	const { error } = await supabase.auth.signOut()

	return { error }
}

export const getSession = async () => {
	const { data, error } = await supabase.auth.getSession()

	return {
		data: {
			session: data?.session ?? null,
		},
		error,
	}
}

export const fetchProfile = async (userId) => {
	const { data, error } = await supabase
		.from('profiles')
		.select('*')
		.eq('id', userId)
		.single()

	return {
		data: {
			profile: data ?? null,
		},
		error,
}
}

export const onAuthStateChange = (callback) => supabase.auth.onAuthStateChange(callback)
