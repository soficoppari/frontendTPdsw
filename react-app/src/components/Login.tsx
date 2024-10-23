import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
        {
          email,
          contraseniaUser,
        }
      );

      // Guardar el token JWT en localStorage
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('email', response.data.data.email); // Guarda el email en lugar de username
      localStorage.setItem('usuarioId', response.data.data.usuarioId); // Guardar el ID del usuario

      setSuccess('Login exitoso');
      navigate('/');
    } catch (err) {
      setError('Email o contraseña incorrectos');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contraseniaUser}
            onChange={(e) => setContraseniaUser(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
