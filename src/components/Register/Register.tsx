import React from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './Register.module.css';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleUserRegister = () => {
    navigate('/registerUsuario');
  };

  const handleVetRegister = () => {
    navigate('/registerVeterinario');
  };

  return (
    <>
          <div className={styles.centerContainer}>
      <h1 className={styles.title}>Bienvenido a Vetify</h1>
      <h3 className={styles.title} style={{ marginBottom: '30px' }}>
          Selecciona un tipo de registro
      </h3>

        <div className={styles.buttonGroup}>
          <button onClick={handleUserRegister} className={styles.button}>
            Usuario
          </button>
          <button onClick={handleVetRegister} className={styles.button}>
            Veterinario
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
