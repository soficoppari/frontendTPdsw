import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3000/api/login/', {
        email,
        contrasenia,
      });

      const { token, email: userEmail, role, id } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', role);
      if (role === 'usuario') {
        localStorage.setItem('usuarioId', id);
      } else {
        localStorage.setItem('veterinarioId', id);
      }

      login(token, role);
      setSuccess('Inicio de sesión exitoso.');
      navigate('/');
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(err.response.data.message || 'Error al iniciar sesión.');
      } else {
        setError('Error desconocido.');
      }
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.tittle}>Iniciar Sesión</h2>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.formGroup}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label htmlFor="contrasenia" style={styles.label}>
            Contraseña
          </label>
          <input
            type="password"
            id="contrasenia"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            style={styles.input}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Iniciar Sesión
        </button>
      </form>
      <div style={styles.registerContainer}>
        <p style={styles.registerText}>
          ¿Primera vez aquí?{' '}
          <a href="#" onClick={handleRegister} style={styles.link}>
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    padding: '10px',
  },
  tittle: {
    marginBottom: '5px',
    fontSize: '1.5rem',
    color: '#dcedff',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginBottom: '5px',
  },
  success: {
    color: 'green',
    fontSize: '0.9rem',
    marginBottom: '5px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '300px',
    padding: '10px',
    borderRadius: '6px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '8px',
  },
  label: {
    color: '#dcedff',
    fontSize: '0.9rem',
    marginBottom: '3px',
  },
  input: {
    padding: '4px 6px', // Menor padding para reducir la altura
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.8rem', // Tamaño de fuente más pequeño
    width: '100%',
    maxHeight: '45px', // Ajustar según la altura de la etiqueta
  },

  button: {
    padding: '8px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  registerContainer: {
    marginTop: '10px',
  },
  registerText: {
    fontSize: '0.85rem',
    color: '#dcedff',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
  },
};

export default Login;
