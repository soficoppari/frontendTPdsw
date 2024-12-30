import React from 'react';
import Menu from './Menu/Menu'; // Asegúrate de que la ruta sea correcta
import { CSSProperties } from 'react';

const HomePage: React.FC = () => {
  return (
    <>
      <Menu />
      <div style={styles.colorContainer}>
        <div style={styles.centerContent}>
          <div style={styles.logo}>
            <img
              src="/images/LogoVet.png"
              alt="PetWorld Logo"
              style={styles.logoImage}
            />
          </div>
          <h1 style={styles.title}>Vetify</h1>
          <p style={styles.subtitle}>
            Tu mascota, nuestra prioridad en cada consulta
          </p>
        </div>
      </div>
    </>
  );
};

const styles: {
  colorContainer: CSSProperties;
  centerContent: CSSProperties;
  logo: CSSProperties;
  logoImage: CSSProperties;
  title: CSSProperties;
  subtitle: CSSProperties;
} = {
  colorContainer: {
    width: '100%',
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    textAlign: 'center' as const,
  },
  logo: {
    marginBottom: '20px',
  },
  logoImage: {
    width: '150px',
    height: 'auto',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '10px 0',
    color: '#fff',
  },
  subtitle: {
    fontSize: '1.2rem',
  },
};

export default HomePage;
