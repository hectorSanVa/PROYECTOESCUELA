import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/config';
import './TeacherDashboard.css';

const TeacherDashboard: React.FC = () => {
  const { user } = useUser();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard teacher-dashboard">
      <div className="user-info">
        <div className="user-email">
          Correo: {user?.email}
        </div>
        <div className="user-role">
          Docente
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Mis Cursos</h2>
          <div className="dashboard-actions">
            <button className="action-button primary">Crear nuevo curso</button>
            <button className="action-button">Gestionar cursos existentes</button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Gestión de Tareas</h2>
          <div className="dashboard-actions">
            <button className="action-button primary">Crear nueva tarea</button>
            <button className="action-button">Revisar entregas pendientes</button>
            <button className="action-button">Ver tareas publicadas</button>
          </div>
        </div>

        <div className="dashboard-section task-creation">
          <h2>Análisis con EduBot</h2>
          <div className="file-upload-area">
            <input 
              type="file" 
              id="document-upload" 
              className="file-input"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            />
            <label htmlFor="document-upload" className="file-label">
              <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>{selectedFile ? selectedFile.name : 'Subir documento para análisis'}</span>
            </label>
            <button className="action-button analyze-button" disabled={!selectedFile}>
              <svg className="bot-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2z" strokeWidth="2"/>
                <path d="M4 9a2 2 0 00-2 2v4a2 2 0 002 2h16a2 2 0 002-2v-4a2 2 0 00-2-2H4z" strokeWidth="2"/>
                <path d="M8 16v2a2 2 0 002 2h4a2 2 0 002-2v-2" strokeWidth="2"/>
              </svg>
              Analizar con EduBot
            </button>
          </div>
          <div className="sharing-options">
            <h3>Compartir Resultados</h3>
            <div className="share-buttons">
              <button className="action-button share-button">
                <svg className="share-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Compartir con todos
              </button>
              <button className="action-button share-button">
                <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Seleccionar estudiantes
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Estadísticas</h2>
          <div className="dashboard-actions">
            <button className="action-button">Ver reportes de desempeño</button>
            <button className="action-button">Análisis de participación</button>
            <button className="action-button">Progreso del curso</button>
          </div>
        </div>
      </div>

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard; 