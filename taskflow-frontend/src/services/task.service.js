import { supabase } from './supabaseClient.js'

export async function getTasks(userId, filters = {}) {
  let query = supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  const { data, error } = await query
  if (error) throw error

  return data || []
}

export async function getAllTasks(filters = {}) {
  let query = supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId)
  }

  const { data, error } = await query
  if (error) throw error

  return data || []
}

export async function createTask(payload) {
  const title = payload?.title ?? ''
  const description = payload?.description ?? ''
  const categoryId = payload?.categoryId ?? payload?.category_id ?? null
  const userId = payload?.userId ?? payload?.user_id ?? null

  if (!userId) {
    throw new Error('Missing userId when creating a task.')
  }

   const {
    data: { user },
  } = await supabase.auth.getUser()



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
  return data
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

  const { data, error } = await supabase
    .from('tasks')
    .update(sanitized)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTask(id) {
  const { error } = await supabase.from('tasks').delete().eq('id', id)
  if (error) throw error
}

export async function toggleTaskStatus(id, currentStatus) {
  const nextStatus = currentStatus === 'pendiente' ? 'completada' : 'pendiente'
  return updateTask(id, { status: nextStatus })
}
