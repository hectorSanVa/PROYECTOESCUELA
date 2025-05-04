import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { getCursos, createCurso, deleteCurso } from '../../services/cursos';
import './TeacherDashboard.css';
import { supabase } from '../../supabaseClient';
import DocenteLayout from './DocenteLayout';
import CursosDocente from './CursosDocente';

const LeccionesDocente = () => <div>Lecciones (próximamente)</div>;
const ActividadesDocente = () => <div>Actividades (próximamente)</div>;
const ProgresoDocente = () => <div>Progreso de alumnos (próximamente)</div>;
const RecompensasDocente = () => <div>Recompensas (próximamente)</div>;
const RespuestasIADocente = () => <div>Respuestas IA (próximamente)</div>;
const EstadisticasDocente = () => <div>Estadísticas (próximamente)</div>;

const SECCIONES = [
  'cursos',
  'lecciones',
  'actividades',
  'progreso',
  'recompensas',
  'ia',
  'estadisticas',
];

const TeacherDashboard: React.FC = () => {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cursos, setCursos] = useState<any[]>([]);
  const [nuevoCurso, setNuevoCurso] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seccion, setSeccion] = useState('cursos');

  useEffect(() => {
    if (seccion === 'cursos') cargarCursos();
  }, [seccion]);

  const cargarCursos = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await getCursos();
      setCursos(res.data);
    } catch (e) {
      setCursos([]);
      setError('No se pudieron cargar los cursos');
    }
    setLoading(false);
  };

  const handleCrearCurso = async () => {
    if (nuevoCurso.trim() === '') {
      setError('El nombre del curso no puede estar vacío');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createCurso({ nombre: nuevoCurso });
      setNuevoCurso('');
      setSuccess('Curso creado exitosamente');
      cargarCursos();
    } catch (e) {
      setError('No se pudo crear el curso');
    }
    setLoading(false);
  };

  const handleEliminarCurso = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await deleteCurso(id);
      setSuccess('Curso eliminado');
      cargarCursos();
    } catch (e) {
      setError('No se pudo eliminar el curso');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  let mainContent = null;
  if (seccion === 'cursos') {
    mainContent = <CursosDocente />;
  } else if (seccion === 'lecciones') {
    mainContent = <LeccionesDocente />;
  } else if (seccion === 'actividades') {
    mainContent = <ActividadesDocente />;
  } else if (seccion === 'progreso') {
    mainContent = <ProgresoDocente />;
  } else if (seccion === 'recompensas') {
    mainContent = <RecompensasDocente />;
  } else if (seccion === 'ia') {
    mainContent = <RespuestasIADocente />;
  } else if (seccion === 'estadisticas') {
    mainContent = <EstadisticasDocente />;
  }

  return (
    <DocenteLayout seccion={seccion} setSeccion={setSeccion}>
      {mainContent}
    </DocenteLayout>
  );
};

export default TeacherDashboard; 