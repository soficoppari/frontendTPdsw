import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';
import styles from './Perfil.module.css';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  nroTelefono: number;
}

interface DecodedToken {
  id: number; // Ajusta según sea necesario
}

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth(); // Usar el método logout del contexto

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      // Decodificar el token para obtener el ID del usuario
      const decoded = jwtDecode<DecodedToken>(token); // Usar jwtDecode

      if (!decoded || !decoded.id) {
        setError('Token no válido');
        return;
      }

      const userId = decoded.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/usuario/${userId}`
        );
        setUsuario(response.data.data); // Ajusta según la estructura de tu respuesta
      } catch (err) {
        setError('Error al cargar los datos del usuario');
      }
    };

    fetchUsuario();
  }, []);

  const handleLogout = () => {
    logout(); // Actualiza el estado del contexto y elimina los datos del localStorage
    navigate('/'); // Redirige al usuario a la página principal
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!usuario) {
    return <div>No se encontraron datos de usuario.</div>;
  }

  return (
    <div className={styles.container}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.7rem',
          marginBottom: '2rem',
        }}
      >
        <FaUserCircle size={38} color="#7fdcff" />
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 600,
            color: '#ffffff',
          }}
        >
          {usuario.nombre} {usuario.apellido}
        </span>
      </div>
      <div className={styles.perfilInfo}>
        <p>
          <span className={styles.perfilLabel}>Email:</span>{' '}
          {usuario.email}
        </p>
        <p>
          <span className={styles.perfilLabel}>Número de Teléfono:</span>{' '}
          {usuario.nroTelefono}
        </p>
      </div>
      <button
        className={styles.logoutButton}
        style={{ width: '100%', marginTop: '2rem' }}
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>
    </div>
  );
};

export default Perfil;
