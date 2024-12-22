import React from 'react';
import { Link } from 'react-router-dom';

const Menu: React.FC = () => {
  // Check if the user is logged in by checking for the presence of a token
  const isLoggedIn = localStorage.getItem('token') !== null;
  const role = localStorage.getItem('role'); // Get the role from localStorage

  return (
    <div style={styles.menuContainer}>
      {/* Logo */}
      <div style={styles.logo}>
        <Link to="/">
          <img
            src="/images/LogoVet.png"
            alt="PetWorld Logo"
            style={styles.logoImage}
          />
        </Link>
      </div>

      {/* Conditionally render the links based on the login status and role */}
      <div style={styles.navLinks}>
        {isLoggedIn ? (
          role === 'veterinario' ? (
            <>
              <Link style={styles.link} to="/PerfilVeterinario">
                Perfil
              </Link>
              <Link style={styles.link} to="/TurnosVeterinario">
                Turnos
              </Link>
              <Link style={styles.link} to="/CalificacionesVeterinario">
                Calificaciones
              </Link>
            </>
          ) : (
            <>
              <Link style={styles.link} to="/perfil">
                Perfil
              </Link>
              <Link style={styles.link} to="/mascotas">
                Mascotas
              </Link>
              <Link style={styles.link} to="/turnos">
                Turnos
              </Link>
            </>
          )
        ) : (
          <Link style={{ ...styles.link, ...styles.loginButton }} to="/login">
            <span role="img" aria-label="user-icon">
              👤
            </span>{' '}
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

const styles = {
  menuContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px',
    backgroundColor: '#17202a',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    zIndex: 1000,
  },
  logo: {},
  logoImage: {
    height: '60px',
    width: '100%',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    color: '#fff',
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    fontSize: '22px',
  },
  loginButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
};

export default Menu;
