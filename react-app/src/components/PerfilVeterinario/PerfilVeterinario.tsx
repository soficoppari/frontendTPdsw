import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './PerfilVeterinario.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserMd } from 'react-icons/fa'; // Agrega este import

interface Veterinario {
  id: number;
  matricula: number;
  nombre: string;
  apellido: string;
  direccion: string;
  nroTelefono: number;
  email: string;
}

interface DecodedToken {
  id: number; // Ajusta según sea necesario
}

const PerfilVeterinario: React.FC = () => {
  const navigate = useNavigate();
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth(); // Usar el método logout del contexto

  useEffect(() => {
    const fetchVeterinario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      // Decodificar el token para obtener el ID del veterinario
      const decoded = jwtDecode<DecodedToken>(token); // Usar jwtDecode

      if (!decoded || !decoded.id) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      const veterinarioId = decoded.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/veterinario/${veterinarioId}`
        );
        setVeterinario(response.data.data); // Ajusta según la estructura de tu respuesta
      } catch (err) {
        setError('Error al cargar los datos del veterinario');
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinario();
  }, []);

  const handleLogout = () => {
    logout(); // Actualiza el estado del contexto y elimina los datos del localStorage
    navigate('/'); // Redirige al usuario a la página principal
  };

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
  <div className={styles.perfilContainer}>
    {veterinario ? (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.7rem', marginBottom: '2rem' }}>
          <FaUserMd size={38} color="#7fdcff" />
          <span style={{ fontSize: '2rem', fontWeight: 600, color: '#ffffff' }}>
            {veterinario.nombre} {veterinario.apellido}
          </span>
        </div>
        <div className={styles.perfilInfo}>
          <p>
            <span className={styles.perfilLabel}>Matrícula:</span>{' '}
            {veterinario.matricula}
          </p>
          <p>
            <span className={styles.perfilLabel}>Dirección:</span>{' '}
            {veterinario.direccion}
          </p>
          <p>
            <span className={styles.perfilLabel}>Teléfono:</span>{' '}
            {veterinario.nroTelefono}
          </p>
          <p>
            <span className={styles.perfilLabel}>Email:</span>{' '}
            {veterinario.email}
          </p>
          <button className={styles.logoutButton} onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </>
    ) : (
      <p className={styles.perfilLoading}>Cargando datos...</p>
    )}
  </div>
);
};

export default PerfilVeterinario;
