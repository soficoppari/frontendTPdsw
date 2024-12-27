import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Menu: React.FC = () => {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn === null) {
    return <div>Cargando...</div>;
  }

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
            👤 Login
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
