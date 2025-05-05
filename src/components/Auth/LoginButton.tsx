import React from 'react';
import { supabase } from '../../supabaseClient';
import './LoginButton.css';

const LoginButton: React.FC = () => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // Obtener la sesión al cargar el componente
  React.useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || session.user.email || '')}`
        });
      }
    };

    checkSession();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.email,
          avatar: session.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.user_metadata?.full_name || session.user.email || '')}`
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          },
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-info">
          <img 
            src={user.avatar} 
            alt="Foto de perfil" 
            className="profile-photo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || '')}`;
            }}
          />
          <div className="user-details">
            <span className="user-name">{user.name}</span>
            <button 
              onClick={handleSignOut} 
              className="logout-button"
              disabled={loading}
            >
              {loading ? 'Cerrando...' : 'Cerrar Sesión'}
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={signInWithGoogle} 
          className="login-button"
          disabled={loading}
        >
          {loading ? (
            <div className="button-loader"></div>
          ) : (
            <>
              <img src="/google-icon.svg" alt="Google" className="google-icon" />
              Iniciar con Google
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LoginButton;