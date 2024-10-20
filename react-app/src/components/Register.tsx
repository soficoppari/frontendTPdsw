import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [nroTelefono, setNroTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar si las contraseñas coinciden
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      // Hacer la petición al backend para registrar el usuario
      const response = await fetch('http://localhost:3000/api/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          nroTelefono,
          contraseniaUser: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error registering');
        return;
      }

      // Registro exitoso, redirige al login
      setSuccess(true);
      navigate('/login');
    } catch (err) {
      setError('Failed to register');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p>{error}</p>}
      {success && <p>Registration successful! Redirecting to login...</p>}
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label>Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Número de Teléfono</label>
          <input
            type="text"
            value={nroTelefono}
            onChange={(e) => setNroTelefono(e.target.value)}
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
