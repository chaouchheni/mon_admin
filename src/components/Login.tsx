// src/components/Login.tsx
import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: ''
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.username?.trim()) {
      setError('L\'email est requis');
      return false;
    }
    if (!formData.password?.trim()) {
      setError('Le mot de passe est requis');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn(formData.username, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (error: any) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const getErrorDisplay = (error: string): string => {
    const errorMappings: Record<string, string> = {
      'User does not exist': 'Utilisateur inexistant',
      'Incorrect username or password': 'Email ou mot de passe incorrect',
      'User is not confirmed': 'Utilisateur non confirmé',
      'Password attempts exceeded': 'Trop de tentatives. Réessayez plus tard',
      'Network Error': 'Erreur de réseau. Vérifiez votre connexion',
    };

    return errorMappings[error] || error;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  fill="none"/>
          </svg>
        </div>
        
        <h1 className="login-title">
          Interface d'Administration
        </h1>
        <p className="login-subtitle">
          Connectez-vous pour accéder au panneau d'administration
        </p>
        
        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="alert alert-error">
              <div className="alert-icon">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div>{getErrorDisplay(error)}</div>
              <button 
                type="button"
                onClick={() => setError('')}
                className="alert-close"
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Email / Nom d'utilisateur
            </label>
            <input
              id="username"
              name="username"
              type="email"
              autoComplete="email"
              required
              className="form-input"
              placeholder="Entrez votre email"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="form-input"
              placeholder="Entrez votre mot de passe"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {loading ? (
              <>
                <div className="loading-spinner" style={{ marginRight: '0.5rem' }}></div>
                Connexion...
              </>
            ) : (
              <>
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20" style={{ marginRight: '0.5rem' }}>
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Se connecter
              </>
            )}
          </button>
          

          <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: '#718096' }}>
            En vous connectant, vous acceptez nos conditions d'utilisation
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;