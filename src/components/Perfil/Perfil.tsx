import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

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

interface DecodedToken {
  id: number; // Ajusta según sea necesario
}

const Perfil: React.FC = () => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa');
        return;
      }

      // Preferimos el id guardado en localStorage al loguearse;
      // como fallback decodificamos el token.
      let userId: number | null = null;
      const storedId = localStorage.getItem('usuarioId');
      if (storedId) {
        userId = Number(storedId);
      } else {
        try {
          const decoded = jwtDecode<DecodedToken>(token);
          if (decoded?.id) userId = decoded.id;
        } catch {
          userId = null;
        }
      }

      if (!userId) {
        setError('No se pudo identificar al usuario. Iniciá sesión nuevamente.');
        return;
      }

      try {
        const response = await apiClient.get(`/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuario(response.data.data);
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          // Token vencido o inválido: cerramos sesión y mandamos al login
          logout();
          navigate('/login');
          return;
        }
        const backendMsg = err?.response?.data?.message;
        setError(backendMsg || 'Error al cargar los datos del usuario');
      }
    };

    fetchUsuario();
  }, [logout, navigate]);


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
    </div>
  );
};

export default Perfil;
