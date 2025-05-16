export async function getActividades() {
  const token = localStorage.getItem('supabase_token');
  if (!token) {
    return { data: [] };
  }
  try {
    const response = await fetch('http://localhost:3001/api/actividades', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      throw new Error('Error al obtener las actividades');
    }
    const result = await response.json();
    return {
      data: Array.isArray(result.data) ? result.data : [],
      success: result.success,
      error: result.error
    };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error.message : 'Error desconocido' };
  }
}

export async function createActividad(data: any) {
  const token = localStorage.getItem('supabase_token');
  if (!token) throw new Error('No se encontró el token de autenticación');
  const response = await fetch('http://localhost:3001/api/actividades', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al crear la actividad');
  }
  return await response.json();
}

export async function updateActividad(id: number, data: any) {
  const token = localStorage.getItem('supabase_token');
  if (!token) throw new Error('No se encontró el token de autenticación');
  const response = await fetch(`http://localhost:3001/api/actividades/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al editar la actividad');
  }
  return await response.json();
}

export async function deleteActividad(id: number) {
  const token = localStorage.getItem('supabase_token');
  if (!token) throw new Error('No se encontró el token de autenticación');
  const response = await fetch(`http://localhost:3001/api/actividades/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al eliminar la actividad');
  }
  return { success: true };
} 