import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Menu.module.css';
import {
  FaUserCircle,
  FaPaw,
  FaCalendarAlt,
  FaStar,
  FaStethoscope,
  FaSignInAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa';

const Menu: React.FC = () => {
  const { isLoggedIn, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  if (isLoggedIn === null) return null;

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.brand} onClick={closeMenu}>
        <img src="/images/LogoVet.png" alt="Vetify" className={styles.logoImg} />
        <span className={styles.brandName}>Vetify</span>
      </NavLink>

      <button
        className={styles.burger}
        onClick={toggleMenu}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        {isLoggedIn ? (
          role === 'veterinario' ? (
            <>
              <NavLink
                to="/PerfilVeterinario"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <FaUserCircle className={styles.linkIcon} />
                <span>Perfil</span>
              </NavLink>
              <NavLink
                to="/TurnosVeterinario"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <FaCalendarAlt className={styles.linkIcon} />
                <span>Turnos</span>
              </NavLink>
              <NavLink
                to="/CalificacionesVeterinario"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <FaStar className={styles.linkIcon} />
                <span>Calificaciones</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to="/perfil"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <FaUserCircle className={styles.linkIcon} />
                <span>Perfil</span>
              </NavLink>
              <NavLink
                to="/mascotas"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <FaPaw className={styles.linkIcon} />
                <span>Mascotas</span>
              </NavLink>
              <NavLink
                to="/turnos"
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ''}`
                }
                onClick={closeMenu}
              >
                <FaStethoscope className={styles.linkIcon} />
                <span>Turnos</span>
              </NavLink>
            </>
          )
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.active : ''}`
            }
            onClick={closeMenu}
          >
            <FaSignInAlt className={styles.linkIcon} />
            <span>Iniciar Sesión</span>
          </NavLink>
        )}
      </nav>

      {menuOpen && <div className={styles.backdrop} onClick={closeMenu} />}
    </header>
  );
};

export default Menu;
