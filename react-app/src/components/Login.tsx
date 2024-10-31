import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contraseniaUser, setContraseniaUser] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost:3000/api/usuario/login',
        { email, contraseniaUser }
      );

      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('email', response.data.data.email);
      localStorage.setItem('usuarioId', response.data.data.usuarioId);

      setSuccess('Login exitoso');
      navigate('/');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <>
      <Menu />
      <div
        style={
          {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
          } as React.CSSProperties
        }
      >
        <h2 style={{ marginBottom: '20px', color: '#fff' }}>Iniciar Sesión</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email:
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
            <label htmlFor="contraseniaUser" style={styles.label}>
              Contraseña:
            </label>
            <input
              type="password"
              id="contraseniaUser"
              value={contraseniaUser}
              onChange={(e) => setContraseniaUser(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>
            Iniciar Sesión
          </button>
        </form>
        <div style={{ marginTop: '15px' }}>
          <p>
            ¿Primera vez aquí?{' '}
            <a href="#" onClick={handleRegister} style={styles.link}>
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    padding: '3px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '5px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
  },
  link: { textDecoration: 'none' },
};

export default Login;
