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
