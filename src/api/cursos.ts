// Función para crear un curso
export async function createCurso({ nombre, descripcion }: { nombre: string; descripcion: string }) {
  const token = localStorage.getItem('supabase_token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch('http://localhost:3001/api/cursos', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
   
    },
    body: JSON.stringify({ nombre, descripcion }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Error al crear el curso');
  }
  return await response.json();
}

// Obtener todos los cursos - CORREGIDA
// src/api/cursos.ts
export async function getCursos() {
  const token = localStorage.getItem('supabase_token');
  if (!token) {
    console.error('No hay token de autenticación');
    return { data: [] };
  }

  try {
    const response = await fetch('http://localhost:3001/api/cursos', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    // Asegúrate de que la respuesta tenga la estructura correcta
    return {
      data: Array.isArray(result.data) ? result.data : [],
      success: result.success,
      error: result.error
    };
    
  } catch (error) {
    console.error('Error en getCursos:', error);
    return { 
      data: [],
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
// Eliminar un curso
export async function deleteCurso(id: string) {
  const token = localStorage.getItem('supabase_token'); // Cambiado a supabase_token
  const response = await fetch(`http://localhost:3001/api/cursos/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el curso');
  }
  return response.json();
}