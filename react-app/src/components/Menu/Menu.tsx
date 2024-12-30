import React from 'react';
import { NavLink } from 'react-router-dom'; // Usamos NavLink
import { useAuth } from '../../context/AuthContext';
import './Menu.css';

const Menu: React.FC = () => {
  const { isLoggedIn, role } = useAuth();

  if (isLoggedIn === null) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="menu-container">
      {/* Logo */}
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
