import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Turnos.module.css';
import Toast, { useToast } from '../Toast/Toast';

// Componente para mostrar estrellas según la puntuación
const RatingStars = ({ value, max = 5 }: { value: number; max?: number }) => {
  return (
    <span className={styles.stars}>
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          className={i < Math.round(value) ? styles.star : styles.starEmpty}
        >
          ★
        </span>
      ))}
    </span>
  );
};

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
  matricula: number;
  direccion: string;
};

type Mascota = {
  id: number;
  nombre: string;
};

type Calificacion = {
  id: number;
  puntuacion: number;
};

type Turno = {
  id: number;
  estado: 'AGENDADO' | 'COMPLETADO' | string;
  fechaHora: string;
  mascota: Mascota;
  veterinario: Veterinario;
  calificacion?: Calificacion | null;
};

const formatFechaHoraBonitaUTC = (fechaHora: string) => {
  const fecha = new Date(fechaHora);
  const dia = fecha.getUTCDate();
  const mes = fecha.toLocaleString('es-AR', { month: 'long', timeZone: 'UTC' });
  let hora = fecha.getUTCHours();
  const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hora < 12 ? 'a. m.' : 'p. m.';
  if (hora === 0) hora = 12;
  else if (hora > 12) hora -= 12;
  return `${dia} de ${mes}, ${hora.toString().padStart(2, '0')}:${minutos} ${ampm}`;
};

// Skeleton de una card
const SkeletonCard = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonLine} style={{ width: '50%' }} />
    <div className={styles.skeletonLine} style={{ width: '70%' }} />
    <div className={styles.skeletonLine} style={{ width: '60%' }} />
  </div>
);

const Turnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [turnoAEliminar, setTurnoAEliminar] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, addToast, removeToast } = useToast();

  const fetchTurnos = async () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      setError('Usuario no encontrado');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/api/turno', {
        headers: { Authorization: `Bearer ${token}` },
        params: { usuarioId: usuarioId },
      });

      const turnosData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      setTurnos(turnosData);
    } catch (err) {
      setError('Error al obtener los turnos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTurnos();
  }, [location]);

  const deleteTurno = async (turnoId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3000/api/turno/${turnoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTurnos();
      addToast('Turno cancelado correctamente', 'success');
    } catch (err) {
      addToast('No se pudo cancelar el turno. Intentá de nuevo.', 'error');
    }
  };

  const confirmarCancelacion = async () => {
    if (turnoAEliminar !== null) {
      await deleteTurno(turnoAEliminar);
      setTurnoAEliminar(null);
    }
  };

  const now = new Date();
  const nowUTC = Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
    now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()
  );

  const turnosProximos = turnos.filter(
    (t) => t.estado === 'AGENDADO' && Date.parse(t.fechaHora) >= nowUTC
  );
  const turnosCompletados = turnos.filter((t) => t.estado === 'COMPLETADO');

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className={styles.container}>
        <h1 className={styles.title}>Tus Turnos</h1>

        {error && (
          <div className={styles.errorBox}>⚠️ {error}</div>
        )}

        <div className={styles.turnosGrid}>
          {/* Próximos */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} style={{ background: '#4c87af' }} />
              <h2 className={styles.sectionTitle}>Próximos</h2>
              <span className={styles.badge}>{turnosProximos.length}</span>
            </div>

            {loading ? (
              <>{[1, 2].map((i) => <SkeletonCard key={i} />)}</>
            ) : turnosProximos.length > 0 ? (
              <div className={styles.cards}>
                {turnosProximos.map((turno) => (
                  <div key={turno.id} className={styles.card}>
                    <div className={styles.cardTopRow}>
                      <div className={styles.cardDate}>
                        📅 {formatFechaHoraBonitaUTC(turno.fechaHora)}
                      </div>
                      <span className={styles.idBadge}>#{turno.id}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Mascota</span>
                      <span className={styles.cardValue}>🐾 {turno.mascota.nombre}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Veterinario</span>
                      <span className={styles.cardValue}>
                        Dr. {turno.veterinario.nombre} {turno.veterinario.apellido}
                      </span>
                    </div>
                    <button
                      className={styles.cancelarBtn}
                      onClick={() => setTurnoAEliminar(turno.id)}
                    >
                      Cancelar turno
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span>📭</span>
                <p>No tenés turnos próximos</p>
              </div>
            )}
          </section>

          {/* Completados */}
          <section className={styles.section}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionDot} style={{ background: '#22c55e' }} />
              <h2 className={styles.sectionTitle}>Atenciones recientes</h2>
              <span className={styles.badge}>{turnosCompletados.length}</span>
            </div>

            {loading ? (
              <>{[1, 2].map((i) => <SkeletonCard key={i} />)}</>
            ) : turnosCompletados.length > 0 ? (
              <div className={styles.cards}>
                {turnosCompletados.map((turno) => (
                  <div key={turno.id} className={styles.card}>
                    <div className={styles.cardTopRow}>
                      <div className={styles.cardDate}>
                        📅 {formatFechaHoraBonitaUTC(turno.fechaHora)}
                      </div>
                      <span className={styles.idBadge}>#{turno.id}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Mascota</span>
                      <span className={styles.cardValue}>🐾 {turno.mascota.nombre}</span>
                    </div>
                    <div className={styles.cardRow}>
                      <span className={styles.cardLabel}>Veterinario</span>
                      <span className={styles.cardValue}>
                        Dr. {turno.veterinario.nombre} {turno.veterinario.apellido}
                      </span>
                    </div>
                    <div className={styles.cardActions}>
                      {turno.calificacion ? (
                        <RatingStars value={turno.calificacion.puntuacion} />
                      ) : (
                        <button
                          className={styles.calificarBtn}
                          onClick={() => navigate(`/CalificarTurno/${turno.id}`)}
                        >
                          ⭐ Calificar
                        </button>
                      )}
                      <button
                        className={styles.actionButton}
                        onClick={() => navigate(`/ResumenTurno/${turno.id}`)}
                      >
                        Resumen
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span>🩺</span>
                <p>No hay atenciones recientes</p>
              </div>
            )}
          </section>
        </div>

        {/* Modal de confirmación */}
        {turnoAEliminar !== null && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.modalIcon}>🗑️</div>
              <p className={styles.modalTexto}>
                ¿Estás seguro de que querés cancelar este turno?
              </p>
              <p className={styles.modalSubTexto}>Esta acción no se puede deshacer.</p>
              <div className={styles.modalBotones}>
                <button className={styles.modalConfirmar} onClick={confirmarCancelacion}>
                  Sí, cancelar
                </button>
                <button className={styles.modalVolver} onClick={() => setTurnoAEliminar(null)}>
                  Volver
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Turnos;
