import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageWrapper}>
      {/* Imagen hero de fondo */}
      <div className={styles.heroImageWrapper}>
        <img
          src="/images/perros-hero.jpg"
          alt="Perros felices en el parque"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* Contenido encima de la imagen */}
      <div className={styles.heroContent}>
        <div className={styles.logoRow}>
          <img
            src="/images/LogoVet.png"
            alt="Vetify Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.brand}>Vetify</h1>
        </div>

        <p className={styles.subtitle}>Tu mascota, nuestra prioridad en cada consulta</p>

        <div className={styles.ctaButtons}>
          <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className={styles.btnSecondary} onClick={() => navigate('/register')}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
