import { supabase } from './supabase'

/**
 * Obtener lista de propiedades activas.
 * Permite filtrar por tipo, operación, habitaciones y zona si se especifican.
 */
export async function getProperties(filters = {}) {
  let query = supabase
    .from('properties')
    .select('*, profiles(name)')
    .eq('is_active', true)

  if (filters.type && filters.type !== 'TODOS') {
    query = query.eq('type', filters.type)
  }
  if (filters.operation && filters.operation !== 'TODOS') {
    query = query.eq('operation', filters.operation)
  }
  if (filters.bedrooms && filters.bedrooms !== 'TODOS') {
    query = query.eq('bedrooms', parseInt(filters.bedrooms, 10))
  }
  if (filters.zone && filters.zone.trim() !== '') {
    query = query.ilike('zone', `%${filters.zone.trim()}%`)
  }

  // Ordenar por fecha de creación descendente
  query = query.order('created_at', { ascending: false })

  const { data, error } = await query
  if (error) throw error
  return data
}

/**
 * Obtener todas las propiedades (activas e inactivas) para el panel de administración o agente.
 */
export async function getAllPropertiesAdmin() {
  const { data, error } = await supabase
    .from('properties')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/**
 * Obtener propiedades asociadas a un agente específico.
 */
export async function getAgentProperties(agentId) {
  const { data, error } = await supabase
    .from('properties')
    .select('*, profiles(name)')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

/**
 * Obtener una sola propiedad por su UUID.
 */
export async function getPropertyById(id) {
  const { data, error } = await supabase
    .from('properties')
    .select('*, profiles(name)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

/**
 * Crear una nueva propiedad.
 * El agente/administrador logueado se asocia automáticamente en Supabase.
 */
export async function createProperty(propertyData) {
  const { data, error } = await supabase
    .from('properties')
    .insert([propertyData])
    .select()
  if (error) throw error
  return data[0]
}

/**
 * Actualizar una propiedad existente.
 */
export async function updateProperty(id, propertyData) {
  const { data, error } = await supabase
    .from('properties')
    .update(propertyData)
    .eq('id', id)
    .select()
  if (error) throw error
  return data[0]
}

/**
 * Eliminar una propiedad (físicamente de la DB).
 */
export async function deleteProperty(id) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)
  if (error) throw error
  return true;
}

/**
 * Cargar una imagen en el bucket publico 'property-images' de Supabase Storage.
 * Retorna la URL pública de la imagen cargada.
 */
export async function uploadPropertyImage(file) {
  // Limpiar el nombre del archivo
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
  const filePath = `properties/${fileName}`

  // Subir el archivo al bucket
  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file)

  if (uploadError) {
    throw uploadError
  }

  // Obtener URL pública
  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
