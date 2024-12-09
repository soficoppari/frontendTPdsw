import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '150vh',
    padding: '80px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'white',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  link: {
    textDecoration: 'none',
    color: '#007bff',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
  },
};

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
          contraseniaUser: password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error al registrarse');
        return;
      }

      setSuccess(true);
      navigate('/login');
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
      <div style={styles.container}>
        <h2 style={{ marginBottom: '10px', color: 'white' }}>Registro Usuario</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p style={styles.success}>
            ¡Registro exitoso! Redirigiendo al login...
          </p>
        )}
        <form style={styles.form} onSubmit={handleRegister}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              style={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Apellido</label>
            <input
              type="text"
              style={styles.input}
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número de Teléfono</label>
            <input
              type="text"
              style={styles.input}
              value={nroTelefono}
              onChange={(e) => setNroTelefono(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirmar Contraseña</label>
            <input
              type="password"
              style={styles.input}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            style={{
              ...styles.button,
              backgroundColor: '#007bff',
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = '#0056b3')
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = '#007bff')
            }
          >
            Registrarse
          </button>
        </form>
        <div>
          <p>
            ¿Ya tienes una cuenta?{' '}
            <span style={styles.link} onClick={handleNavigateToLogin}>
              Inicia sesión
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default RegisterUsuario;
