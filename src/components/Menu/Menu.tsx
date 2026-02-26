import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Menu.module.css';
import {
  FaUserCircle,
  FaPaw,
  FaCalendarAlt,
  FaStar,
  FaStethoscope,
  FaSignInAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from 'react-icons/fa';

const Menu: React.FC = () => {
  const { isLoggedIn, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    logout();
    navigate('/');
  };

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
          <>
            {role === 'veterinario' ? (
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
            )}
            {/* Botón Cerrar Sesión + popover */}
            <div className={styles.logoutWrapper}>
              <button
                className={styles.logoutBtn}
                onClick={() => setShowLogoutModal((v) => !v)}
                aria-label="Cerrar sesión"
              >
                <FaSignOutAlt className={styles.linkIcon} />
                <span>Cerrar Sesión</span>
              </button>

              {showLogoutModal && (
                <div className={styles.logoutPopover}>
                  <p className={styles.popoverText}>¿Cerrar la sesión?</p>
                  <div className={styles.popoverActions}>
                    <button
                      className={styles.popoverCancel}
                      onClick={() => setShowLogoutModal(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className={styles.popoverConfirm}
                      onClick={handleLogoutConfirm}
                    >
                      Confirmar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          location.pathname === '/login' || location.pathname.startsWith('/register') ? (
            <button
              className={styles.link}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => {
                closeMenu();
                navigate(-1);
              }}
            >
              <FaArrowLeft className={styles.linkIcon} />
              <span>Volver</span>
            </button>
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
          )
        )}
      </nav>

      {menuOpen && <div className={styles.backdrop} onClick={closeMenu} />}

      {/* Clic fuera del popover para cerrarlo */}
      {showLogoutModal && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          onClick={() => setShowLogoutModal(false)}
        />
      )}
    </header>
  );
};

export default Menu;
