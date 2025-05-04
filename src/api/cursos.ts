// Función para crear un curso
export async function createCurso({ nombre, descripcion }: { nombre: string; descripcion: string }) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cursos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre, descripcion }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al crear el curso');
  }
  return response.json();
}

// Obtener todos los cursos
export async function getCursos() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cursos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Error al obtener los cursos');
  }
  return response.json();
}

// Eliminar un curso
export async function deleteCurso(id: string) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:3001'}/api/cursos/${id}`, {
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