import { supabase } from './supabase'

/**
 * Obtener lista de propiedades activas.
 * Permite filtrar por tipo (subtype), operación, habitaciones (rooms) y ubicación (location) si se especifican.
 */
export async function getProperties(filters = {}) {
  let query = supabase
    .from('properties')
    .select('*, profiles(name)')
    .eq('is_active', true)

  if (filters.type && filters.type !== 'todos' && filters.type !== 'TODOS') {
    // En el index.html original, filter-type se comparaba contra subtype
    query = query.eq('subtype', filters.type)
  }
  if (filters.operation && filters.operation !== 'todos' && filters.operation !== 'TODOS') {
    query = query.eq('operation', filters.operation)
  }
  if (filters.rooms && filters.rooms !== 'todos' && filters.rooms !== 'TODOS') {
    query = query.eq('rooms', parseInt(filters.rooms, 10))
  }
  if (filters.zone && filters.zone.trim() !== '') {
    const term = filters.zone.trim().toLowerCase();
    
    // Normalizar zonas comunes de Santa Marta para soportar abreviaciones y tildes
    if (term.includes('bolivar') || term.includes('bolívar') || term.includes('p. de') || term.includes('parques de') || term.includes('p. bolivar') || term.includes('p. bolívar')) {
      query = query.or('location.ilike.%Bolivar%,location.ilike.%Bolívar%');
    } else if (term.includes('rodadero')) {
      query = query.ilike('location', '%Rodadero%');
    } else if (term.includes('bello horizonte') || term.includes('horizonte') || term.includes('bello')) {
      query = query.or('location.ilike.%Bello Horizonte%,location.ilike.%Bello%,location.ilike.%Horizonte%');
    } else if (term.includes('centro') || term.includes('historico') || term.includes('histórico')) {
      query = query.or('location.ilike.%Centro%,location.ilike.%Histórico%,location.ilike.%Historico%');
    } else if (term.includes('mamatoco')) {
      query = query.ilike('location', '%Mamatoco%');
    } else if (term.includes('gaira')) {
      query = query.ilike('location', '%Gaira%');
    } else {
      // Búsqueda genérica: enviamos la versión original y la desacentuada para compatibilidad
      const unaccented = term.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (unaccented !== term) {
        query = query.or(`location.ilike.%${term}%,location.ilike.%${unaccented}%`);
      } else {
        query = query.ilike('location', `%${term}%`);
      }
    }
  }

  // Ordenar por ID descendente
  query = query.order('id', { ascending: false })

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
    .order('id', { ascending: false })
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
    .order('id', { ascending: false })
  if (error) throw error
  return data
}

/**
 * Obtener una sola propiedad por su ID numérico.
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
 * Eliminar una propiedad físicamente de la DB y borrar sus imágenes del Storage.
 */
export async function deleteProperty(id) {
  // 1. Obtener la propiedad para saber qué imágenes eliminar
  const { data: propData } = await supabase
    .from('properties')
    .select('images')
    .eq('id', id)
    .single()

  // 2. Eliminar registro de base de datos
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id)

  if (error) throw error

  // 3. Eliminar archivos de almacenamiento de Supabase si existen
  if (propData && propData.images) {
    const filesToRemove = propData.images
      .filter(url => url.includes('property-images'))
      .map(url => url.substring(url.lastIndexOf('/') + 1))

    if (filesToRemove.length > 0) {
      await supabase.storage
        .from('property-images')
        .remove(filesToRemove)
    }
  }

  return true
}

/**
 * Cargar una imagen en el bucket publico 'property-images' de Supabase Storage.
 * Retorna la URL pública de la imagen cargada.
 */
export async function uploadPropertyImage(file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(fileName, file)

  if (uploadError) {
    throw uploadError
  }

  const { data } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName)

  return data.publicUrl
}

/**
 * Registrar una nueva visita en la base de datos 'visits'.
 */
export async function scheduleVisit(visitData) {
  const { data, error } = await supabase
    .from('visits')
    .insert([visitData])
    .select()
  if (error) throw error
  return data[0]
}

