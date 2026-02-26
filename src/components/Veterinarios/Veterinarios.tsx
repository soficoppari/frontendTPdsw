import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Veterinarios.module.css';

type Horario = {
  id: number;
  dia: string;
  horaFin: Date;
  horaInicio: Date;
};

type Turno = {
  id: number;
  horario: Horario;
  estado: boolean;
};

type Especie = {
  id: number;
  nombre: string;
};

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
  direccion: string;
  nroTelefono: number;
  horarios: Horario[];
  turnos: Turno[];
  especies: Especie[];
  promedio?: number;
};

// Genera un color de avatar basado en las iniciales
function getAvatarColor(nombre: string, apellido: string): string {
  const colors = [
    'linear-gradient(135deg, #4c87af, #7fdcff)',
    'linear-gradient(135deg, #7c3aed, #a78bfa)',
    'linear-gradient(135deg, #0891b2, #67e8f9)',
    'linear-gradient(135deg, #059669, #6ee7b7)',
    'linear-gradient(135deg, #d97706, #fcd34d)',
    'linear-gradient(135deg, #db2777, #f9a8d4)',
  ];
  const index = (nombre.charCodeAt(0) + apellido.charCodeAt(0)) % colors.length;
  return colors[index];
}

const SkeletonCard = () => (
  <li className={`${styles.card} ${styles.skeletonCard}`}>
    <div className={styles.skeletonAvatar} />
    <div className={styles.skeletonLine} style={{ width: '60%' }} />
    <div className={styles.skeletonLine} style={{ width: '80%' }} />
    <div className={styles.skeletonLine} style={{ width: '70%' }} />
  </li>
);

const VeterinariosList: React.FC = () => {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const especieMascota = localStorage.getItem('especieMascota');
    const especieMascotaId = especieMascota ? Number(especieMascota) : NaN;

    const fetchVeterinarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/veterinario', {
          params: { especie: especieMascotaId },
        });

        let data = response.data?.data;
        if (Array.isArray(data)) {
          data = data.sort((a, b) => (b.promedio ?? 0) - (a.promedio ?? 0));
          setVeterinarios(data);
        } else {
          setVeterinarios([]);
        }
      } catch (err) {
        setError('Error al obtener los veterinarios');
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinarios();
  }, []);

  const handleCardClick = (id: number) => {
    localStorage.setItem('veterinarioId', id.toString());
    navigate(`/AgendarTurno/${id}`);
  };

  const renderStars = (promedio?: number) => {
    if (promedio === undefined || promedio === null) return null;
    const full = Math.floor(promedio);
    const half = promedio - full >= 0.5;
    return (
      <span className={styles.stars}>
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            style={{
              color: i < full || (i === full && half) ? '#fbbf24' : 'rgba(255,255,255,0.2)',
            }}
          >
            ★
          </span>
        ))}
        <span className={styles.ratingNum}>{promedio.toFixed(1)}</span>
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profesionales</h1>
      <p className={styles.subtitle}>Seleccioná un veterinario para agendar tu turno</p>

      {error && (
        <div className={styles.errorBox}>
          <span>⚠️</span> {error}
          <button className={styles.retryBtn} onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <ul className={styles.veterinariosList}>
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </ul>
      ) : veterinarios.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>🐾</span>
          <p>No hay veterinarios disponibles para esta especie.</p>
        </div>
      ) : (
        <ul className={styles.veterinariosList}>
          {veterinarios.map((veterinario) => {
            const initials = `${veterinario.nombre[0]}${veterinario.apellido[0]}`.toUpperCase();
            const avatarBg = getAvatarColor(veterinario.nombre, veterinario.apellido);

            return (
              <li
                key={veterinario.id}
                className={styles.card}
                tabIndex={0}
                role="button"
                onClick={() => handleCardClick(veterinario.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCardClick(veterinario.id);
                }}
              >
                <div className={styles.cardTop}>
                  <div
                    className={styles.avatar}
                    style={{ background: avatarBg }}
                  >
                    {initials}
                  </div>
                  <div className={styles.cardMeta}>
                    <h2 className={styles.cardTitle}>
                      Dr. {veterinario.nombre} {veterinario.apellido}
                    </h2>
                    {typeof veterinario.promedio === 'number'
                      ? renderStars(veterinario.promedio)
                      : <span className={styles.noRating}>Sin calificación</span>}
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <p>📍 <strong>Dirección:</strong> {veterinario.direccion}</p>
                  <p>📞 <strong>Teléfono:</strong> {veterinario.nroTelefono}</p>
                  <p>🐾 <strong>Especies:</strong> {veterinario.especies.map((e) => e.nombre).join(', ')}</p>
                </div>

                <div className={styles.cardFooter}>
                  <span className={styles.agendarBtn}>Agendar turno →</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default VeterinariosList;
