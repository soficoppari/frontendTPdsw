import React, { useState } from 'react';
import axios, { AxiosError } from 'axios'; // Importar AxiosError para tipos
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

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

      // Guardar los datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', role);
      if (role === 'usuario') {
        localStorage.setItem('usuarioId', id);
      } else {
        localStorage.setItem('veterinarioId', id);
      }
      setSuccess('Inicio de sesión exitoso.');

      // Redirigir al home u otra página según el rol
      if (role === 'veterinario') {
        navigate('/veterinario/');
      } else {
        navigate('/');
      }
    } catch (err) {
      // Especificar el tipo de error como AxiosError
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
    <>
      <Menu />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          padding: '20px',
        }}
      >
        <h2 style={{ marginBottom: '10px', color: '#dcedff' }}>
          Iniciar Sesión
        </h2>
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
            <label htmlFor="contrasenia" style={styles.label}>
              Contraseña:
            </label>
            <input
              type="contrasenia"
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
  tittle: {
    color: '#dcedff',
  },
  label: {
    color: '#dcedff',
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
