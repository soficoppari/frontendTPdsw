import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../Menu/Menu';
import './RegisterUsuario.css';

const RegisterUsuario: React.FC = () => {
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

    // Verificar si algún campo está vacío
    if (
      !nombre ||
      !apellido ||
      !email ||
      !nroTelefono ||
      !password ||
      !confirmPassword
    ) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
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
          contrasenia: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error al registrarse');
        return;
      }

      setSuccess(true);
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Error al registrarse');
    }
  };

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <>
      <Menu />
      <div className="container">
        <h2 className="title">Registrate</h2>

        {error && <p className="error">{error}</p>}
        {success && (
          <p className="success">¡Registro exitoso! Redirigiendo al login...</p>
        )}

        <form onSubmit={handleRegister} className="form">
          <div className="form-group">
            <label className="label">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="form-group">
            <label className="label">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="input"
              placeholder="Ingresa tu apellido"
            />
          </div>
          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Ingresa tu email"
            />
          </div>
          <div className="form-group">
            <label className="label">Número de Teléfono</label>
            <input
              type="text"
              value={nroTelefono}
              onChange={(e) => setNroTelefono(e.target.value)}
              className="input"
              placeholder="Ingresa tu número de teléfono"
            />
          </div>
          <div className="form-group">
            <label className="label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Crea una contraseña"
            />
          </div>
          <div className="form-group">
            <label className="label">Confirmar Contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input"
              placeholder="Confirma tu contraseña"
            />
          </div>

          <button type="submit" className="button">
            Registrarse
          </button>
        </form>

        <div style={{ marginTop: '15px' }}>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <a href="#" onClick={handleNavigateToLogin} className="link">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterUsuario;
