import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  return (
    <div style={styles.menuContainer}>
      <div style={styles.logo}>
        <img
          src="/images/LogoVet.png"
          alt="PetWorld Logo"
          style={styles.logoImage}
        />
      </div>
      <div style={styles.navLinks}>
        <Link style={styles.link} to="/login">
          Login
        </Link>
        <Link style={styles.link} to="/mascotas">
          Mascotas
        </Link>
        <Link style={styles.link} to="/veterinarios">
          Veterinarios
        </Link>
      </div>
    </div>
  );
};

const styles = {
  menuContainer: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '13px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  logo: {},

  logoImage: {
    height: '60px', // Ajusta la altura según sea necesario
    width: '100%', // Mantiene la proporción de la imagen
  },

  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  link: {
    textDecoration: 'none',
    color: '#000',
    fontSize: '16px',
  },
};

export default Menu;
