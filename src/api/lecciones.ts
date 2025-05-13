export async function getLecciones() {
  const token = localStorage.getItem('supabase_token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  const response = await fetch('http://localhost:3001/api/lecciones', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al obtener las lecciones');
  }
  return await response.json();
}

export async function createLeccion({ curso_id, titulo, orden, duracion_estimada_min }: { curso_id: number; titulo: string; orden: number; duracion_estimada_min?: number }) {
  const token = localStorage.getItem('supabase_token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  const response = await fetch('http://localhost:3001/api/lecciones', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ curso_id, titulo, orden, duracion_estimada_min }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al crear la lección');
  }
  return await response.json();
}

export async function deleteLeccion(id: number) {
  const token = localStorage.getItem('supabase_token');
  if (!token) throw new Error('No se encontró el token de autenticación');
  const response = await fetch(`http://localhost:3001/api/lecciones/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al eliminar la lección');
  }
  return { success: true };
}

export async function updateLeccion(id: number, data: { titulo?: string; orden?: number; duracion_estimada_min?: number }) {
  const token = localStorage.getItem('supabase_token');
  if (!token) throw new Error('No se encontró el token de autenticación');
  const response = await fetch(`http://localhost:3001/api/lecciones/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al editar la lección');
  }
  return await response.json();
} 