import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styles from './PerfilVeterinario.module.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaIdCard, FaMapMarkerAlt, FaPhone, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import Toast, { useToast } from '../Toast/Toast';

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
  id: number;
}

const PerfilVeterinario: React.FC = () => {
  const navigate = useNavigate();
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchVeterinario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      const decoded = jwtDecode<DecodedToken>(token);

      if (!decoded || !decoded.id) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:3000/api/veterinario/${decoded.id}`
        );
        setVeterinario(response.data.data);
      } catch (err) {
        setError('Error al cargar los datos del veterinario');
        addToast('No se pudieron cargar los datos del perfil', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinario();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.perfilContainer}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonAvatar} />
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
          <div className={styles.skeletonLine} style={{ width: '80%' }} />
          <div className={styles.skeletonLine} style={{ width: '70%' }} />
          <div className={styles.skeletonLine} style={{ width: '75%' }} />
        </div>
      </div>
    );
  }

  if (error || !veterinario) {
    return (
      <div className={styles.perfilContainer}>
        <div className={styles.errorBox}>
          <span className={styles.errorIcon}>⚠️</span>
          <p>{error || 'No se encontraron datos del veterinario'}</p>
          <button className={styles.retryBtn} onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Iniciales para el avatar
  const initials = `${veterinario.nombre[0]}${veterinario.apellido[0]}`.toUpperCase();

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className={styles.perfilContainer}>
        {/* Avatar con iniciales */}
        <div className={styles.avatarSection}>
          <div className={styles.avatar}>{initials}</div>
          <h1 className={styles.nombre}>
            Dr. {veterinario.nombre} {veterinario.apellido}
          </h1>
          <span className={styles.badge}>
            <FaUserMd style={{ marginRight: '0.4rem' }} />
            Veterinario
          </span>
        </div>

        {/* Info cards */}
        <div className={styles.infoGrid}>
          <div className={styles.infoCard}>
            <FaIdCard className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Matrícula</span>
              <span className={styles.infoValue}>{veterinario.matricula}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <FaEnvelope className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{veterinario.email}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <FaPhone className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Teléfono</span>
              <span className={styles.infoValue}>{veterinario.nroTelefono}</span>
            </div>
          </div>

          <div className={styles.infoCard}>
            <FaMapMarkerAlt className={styles.infoIcon} />
            <div>
              <span className={styles.infoLabel}>Dirección</span>
              <span className={styles.infoValue}>{veterinario.direccion}</span>
            </div>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '0.5rem' }} />
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

export default PerfilVeterinario;
