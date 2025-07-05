import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuth } from '../../context/AuthContext';
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
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Perfil del Usuario</h1>
        <div className={styles.card}>
          <div className={styles.cardItem}>
            <strong>Nombre:</strong> {usuario.nombre}
          </div>
          <div className={styles.cardItem}>
            <strong>Apellido:</strong> {usuario.apellido}
          </div>
          <div className={styles.cardItem}>
            <strong>Email:</strong> {usuario.email}
          </div>
          <div className={styles.cardItem}>
            <strong>Número de Teléfono:</strong> {usuario.nroTelefono}
          </div>
        </div>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default Perfil;
