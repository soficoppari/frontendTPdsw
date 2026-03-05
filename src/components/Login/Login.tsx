import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Login.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}></label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="contrasenia" className={styles.label}></label>
          <input
            type="password"
            id="contrasenia"
            placeholder="Contraseña"
            value={contrasenia}
            onChange={(e) => setContrasenia(e.target.value)}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>
          Iniciar Sesión
        </button>
      </form>
      <div className={styles.registerContainer}>
        <p className={styles.registerText}>
          ¿Primera vez aquí?{' '}
          <a href="#" onClick={handleRegister} className={styles.link}>
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
