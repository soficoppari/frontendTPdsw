import React from 'react';
import styles from './HomePage.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={styles.colorContainer}>
      <div className={styles.centerContent}>
        <div className={styles.logo}>
          <img
            src="/images/LogoVet.png"
            alt="PetWorld Logo"
            className={styles.logoImage}
          />
        </div>
        <h1 className={styles.title}>Vetify</h1>
        <p className={styles.subtitle}>
          Tu mascota, nuestra prioridad en cada consulta
        </p>
      </div>
    </div>
  );
};

export default HomePage;
