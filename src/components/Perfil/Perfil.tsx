import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FaUserCircle } from 'react-icons/fa';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';
import styles from './Perfil.module.css';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  nroTelefono: number;
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesion activa');
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/usuario/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data.data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          logout();
          navigate('/login');
          return;
        }
        const backendMsg = err?.response?.data?.message;
        setError(backendMsg || 'Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, [logout, navigate]);

  if (loading) {
    return <div>Cargando perfil...</div>;
  }

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
          <span className={styles.perfilLabel}>Email:</span> {usuario.email}
        </p>
        <p>
          <span className={styles.perfilLabel}>Numero de Telefono:</span>{' '}
          {usuario.nroTelefono}
        </p>
      </div>
    </div>
  );
};

export default Perfil;
