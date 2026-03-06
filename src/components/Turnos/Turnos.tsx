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
  mascota: Mascota & { raza: { especie: { nombre: string } } };
  veterinario: Veterinario;
  calificacion?: Calificacion | null;
  pagado?: boolean;
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
  const [showPoliticas, setShowPoliticas] = useState(true);

  const fetchTurnos = async () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      setError('Usuario no encontrado');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('https://backendtpdsw-production-c234.up.railway.app/api/turno', {
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
    const query = new URLSearchParams(location.search);
    const success = query.get('success');
    const turnoId = query.get('turnoId');

    if (success && turnoId) {
      const token = localStorage.getItem('token');
      axios
        .post(
          'https://backendtpdsw-production-c234.up.railway.app/api/payment/confirm-payment',
          { turnoId },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then(() => {
          addToast('Pago realizado con éxito', 'success');
          // Limpiar la URL sin recargar
          navigate('/Turnos', { replace: true });
        })
        .catch(() => {
          addToast('Error al confirmar el pago', 'error');
        });
    }

    fetchTurnos();
  }, [location]);

  const deleteTurno = async (turnoId: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`https://backendtpdsw-production-c234.up.railway.app/api/turno/${turnoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchTurnos();
      addToast('Turno cancelado correctamente', 'success');
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || 'No se pudo cancelar el turno. Intentá de nuevo.';
      addToast(errorMsg, 'error');
    }
  };

  const payTurno = async (turnoId: number) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post('https://backendtpdsw-production-c234.up.railway.app/api/payment/create-checkout-session',
        { turnoId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (err: any) {
      addToast('Error al procesar el pago', 'error');
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

  // Mostramos todos los turnos agendados en la sección "Próximos", 
  // incluso si ya pasaron (hasta que pasen a la sección de completados)
  const turnosProximos = turnos.filter(
    (t) => t.estado === 'AGENDADO'
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
                {turnosProximos.map((turno) => {
                  const diffMs = Date.parse(turno.fechaHora) - nowUTC;
                  const diffHoras = diffMs / (1000 * 60 * 60);
                  const noSePuedeCancelar = diffHoras < 5;

                  return (
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
                      {turno.pagado ? (
                        <button className={styles.pagadoBtn} disabled>
                          ✅ Turno pagado
                        </button>
                      ) : (
                        <button
                          className={styles.pagarBtn}
                          onClick={() => payTurno(turno.id)}
                        >
                          💳 Pagar turno
                        </button>
                      )}
                      <button
                        className={styles.cancelarBtn}
                        onClick={() => setTurnoAEliminar(turno.id)}
                        disabled={noSePuedeCancelar}
                        title={noSePuedeCancelar ? "No se puede cancelar con menos de 5 horas de anticipación" : ""}
                      >
                        Cancelar turno
                      </button>
                    </div>
                  );
                })}
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
        {/* Modal de políticas de Vetify */}
        {showPoliticas && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <div className={styles.modalIcon}>📜</div>
              <h2 className={styles.modalTexto}>Políticas de Vetify</h2>

              <ul className={styles.modalList}>
                <li className={styles.modalListItem}>
                  <span className={styles.itemNumber}>1</span>
                  Los turnos se pueden cancelar hasta 5 horas antes de la cita.
                </li>
                <li className={styles.modalListItem}>
                  <span className={styles.itemNumber}>2</span>
                  Si el pago del turno no se realiza antes de las 5 horas previas al turno, el mismo se cancelará automáticamente.
                </li>
              </ul>

              <button
                className={styles.modalAceptar}
                onClick={() => setShowPoliticas(false)}
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Turnos;
