import React from 'react';
import { UserProvider, useUser } from './context/UserContext';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import AuthPage from './components/Auth/AuthPage';
import './App.css';

const AppContent: React.FC = () => {
  const { user, loading, role, error } = useUser();

  // Mostrar pantalla de carga
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <p>Cargando...</p>
        <small>Por favor espere mientras verificamos su sesión</small>
      </div>
    );
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="error-screen">
        <h2>Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="reload-button"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Si no hay usuario, mostrar página de autenticación
  if (!user) {
    return <AuthPage />;
  }

  // Si hay usuario pero no hay rol, mostrar error
  if (!role) {
    return (
      <div className="error-screen">
        <h2>Error al cargar el perfil</h2>
        <p>No se pudo determinar el rol del usuario.</p>
        <button 
          onClick={() => window.location.reload()}
          className="reload-button"
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  // Mostrar el dashboard correspondiente según el rol
  return role === 'docente' ? <TeacherDashboard /> : <StudentDashboard />;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
