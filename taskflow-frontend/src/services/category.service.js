import { supabase } from './supabaseClient';

/**
 * Obtiene todas las categorías ordenadas alfabéticamente
 * @returns {Promise<Array>} Array de categorías ordenado por nombre
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Crea una nueva categoría
 * @param {string} name - Nombre de la categoría
 * @returns {Promise<Object>} Categoría creada
 */
export async function createCategory(name) {
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: name.trim() })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Actualiza una categoría existente
 * @param {number} id - ID de la categoría
 * @param {string} name - Nuevo nombre de la categoría
 * @returns {Promise<Object>} Categoría actualizada
 */
export async function updateCategory(id, name) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name: name.trim() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Elimina una categoría
 * Verifica primero que no tenga tareas asociadas
 * @param {number} id - ID de la categoría
 * @returns {Promise<void>}
 */
export async function deleteCategory(id) {
  // Verificar si hay tareas asociadas a esta categoría
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('id')
    .eq('category_id', id);

  if (tasksError) throw tasksError;

  // Si hay tareas asociadas, lanzar error
  if (tasks && tasks.length > 0) {
    throw new Error('No se puede eliminar: tiene tareas asociadas');
  }

  // Eliminar la categoría
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
