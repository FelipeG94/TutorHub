import { supabase } from './supabaseClient.js'

async function attachRelations(tasks) {
  if (!tasks || tasks.length === 0) return tasks

  const userIds = Array.from(new Set(tasks.map((t) => t.user_id).filter(Boolean)))
  const categoryIds = Array.from(new Set(tasks.map((t) => t.category_id).filter(Boolean)))

  // Fetch profiles: try to get email if column exists, otherwise fall back to role-only select
  let profiles
  let profilesError = null

  if (userIds.length) {
    try {
      const res = await supabase.from('profiles').select('id, email').in('id', userIds)
      profiles = res.data
      profilesError = res.error
      if (profilesError) {
        // If selecting email fails (column missing), retry without email
        const res2 = await supabase.from('profiles').select('id, role').in('id', userIds)
        profiles = res2.data
        profilesError = res2.error
      }
    } catch (err) {
      profiles = []
      profilesError = err
    }
  } else {
    profiles = []
    profilesError = null
  }

  const categoriesPromise = categoryIds.length
    ? supabase.from('categories').select('id, name').in('id', categoryIds)
    : Promise.resolve({ data: [], error: null })

  const { data: categories, error: categoriesError } = await categoriesPromise

  if (profilesError) throw profilesError
  if (categoriesError) throw categoriesError

  const profileMap = (profiles || []).reduce((m, p) => {
    m[p.id] = p
    return m
  }, {})

  const categoryMap = (categories || []).reduce((m, c) => {
    m[c.id] = c
    return m
  }, {})

  return tasks.map((t) => ({
    ...t,
    user: profileMap[t.user_id] ?? null,
    category: categoryMap[t.category_id] ?? null,
  }))
}

export async function getTasks(userId, filters = {}) {
  let query = supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false })

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)

  const { data, error } = await query
  if (error) throw error

  return await attachRelations(data || [])
}

export async function getAllTasks(filters = {}) {
  let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })

  if (filters.status) query = query.eq('status', filters.status)
  if (filters.categoryId) query = query.eq('category_id', filters.categoryId)

  const { data, error } = await query
  if (error) throw error

  return await attachRelations(data || [])
}

export async function createTask(payload) {
  const title = payload?.title ?? ''
  const description = payload?.description ?? ''
  const categoryId = payload?.categoryId ?? payload?.category_id ?? null
  const userId = payload?.userId ?? payload?.user_id ?? null

  if (!userId) {
    throw new Error('Missing userId when creating a task.')
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert([
      {
        title: title.trim(),
        description: description.trim(),
        category_id: categoryId || null,
        user_id: userId,
        status: 'pendiente',
      },
    ])
    .select()
    .single()

  if (error) throw error

  const [taskWithRelations] = await attachRelations([data])
  return taskWithRelations
}

export async function updateTask(id, updates) {
  const sanitized = {
    ...(updates.title !== undefined ? { title: updates.title.trim() } : {}),
    ...(updates.description !== undefined ? { description: updates.description.trim() } : {}),
    ...((updates.categoryId !== undefined || updates.category_id !== undefined)
      ? { category_id: (updates.categoryId ?? updates.category_id) || null }
      : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
  }

  const { data, error } = await supabase.from('tasks').update(sanitized).eq('id', id).select().single()
  if (error) throw error

  const [taskWithRelations] = await attachRelations([data])
  return taskWithRelations
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export async function toggleTaskStatus(id, currentStatus) {
  const nextStatus = currentStatus === 'pendiente' ? 'completada' : 'pendiente'
  return updateTask(id, { status: nextStatus })
}
