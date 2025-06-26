import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterUsuario.module.css';

const RegisterUsuario: React.FC = () => {
  const [step, setStep] = useState(1);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nroTelefono, setNroTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const nextStep = () => {
    if (!nombre || !apellido || !nroTelefono) {
      setError('Completa todos los campos del paso 1.');
    } else {
      setError('');
      setStep(2);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError('Completa todos los campos del paso 2.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    } catch {
      setError('Error al registrarse.');
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Registrate</h2>

      {error && <p className={styles.error}>{error}</p>}
      {success && (
        <p className={styles.success}>
          ¡Registro exitoso! Redirigiendo al login...
        </p>
      )}

      <form onSubmit={handleRegister} className={styles.registerForm}>
        {step === 1 && (
          <>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={styles.input}
                placeholder="Nombre"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={styles.input}
                placeholder="Apellido"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={nroTelefono}
                onChange={(e) => setNroTelefono(e.target.value)}
                className={styles.input}
                placeholder="Teléfono"
              />
            </div>
            <button type="button" onClick={nextStep} className={styles.button}>
              Siguiente
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className={styles.formGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Contraseña"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                placeholder="Confirmar Contraseña"
              />
            </div>
            <button type="submit" className={styles.button}>
              Registrarse
            </button>
          </>
        )}
      </form>

      <div style={{ marginTop: '15px' }}>
        <p>
          ¿Ya tienes una cuenta?{' '}
          <span onClick={() => navigate('/login')} className={styles.link}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterUsuario;
