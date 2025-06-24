/*import React from 'react';
import { NavLink } from 'react-router-dom'; // Usamos NavLink
import { useAuth } from '../../context/AuthContext';
import './Menu.module.css';

const Menu: React.FC = () => {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="menu-container">
      {}
      <div className="logo">
        <NavLink to="/">
          <img src="/images/LogoVet.png" alt="PetWorld Logo" />
        </NavLink>
      </div>

      <div className="nav-links">
        {isLoggedIn ? (
          role === 'veterinario' ? (
            <>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                } // Aplicamos la clase activa
                to="/PerfilVeterinario"
              >
                Perfil
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                to="/TurnosVeterinario"
              >
                Turnos
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                to="/CalificacionesVeterinario"
              >
                Calificaciones
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                to="/perfil"
              >
                Perfil
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                to="/mascotas"
              >
                Mascotas
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
                to="/turnos"
              >
                Turnos
              </NavLink>
            </>
          )
        ) : (
          <NavLink
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            to="/login"
          >
            Iniciar Sesión
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Menu;
*/
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Menu.module.css'; // Usamos CSS Modules

const Menu: React.FC = () => {
  const { isLoggedIn, role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  if (isLoggedIn === null) return <div>Cargando...</div>;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <NavLink to="/">
          <img src="/images/LogoVet.png" alt="PetWorld Logo" />
        </NavLink>
      </div>

      <button className={styles.burger} onClick={toggleMenu}>
        ☰
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        {isLoggedIn ? (
          role === 'veterinario' ? (
            <>
              <NavLink to="/PerfilVeterinario" className={styles.link}>
                Perfil
              </NavLink>
              <NavLink to="/TurnosVeterinario" className={styles.link}>
                Turnos
              </NavLink>
              <NavLink to="/CalificacionesVeterinario" className={styles.link}>
                Calificaciones
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/perfil" className={styles.link}>
                Perfil
              </NavLink>
              <NavLink to="/mascotas" className={styles.link}>
                Mascotas
              </NavLink>
              <NavLink to="/turnos" className={styles.link}>
                Turnos
              </NavLink>
            </>
          )
        ) : (
          <NavLink to="/login" className={styles.link}>
            Iniciar Sesión
          </NavLink>
        )}
      </nav>
    </header>
  );
};

export default Menu;
