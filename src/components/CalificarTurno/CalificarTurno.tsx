import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient';
import styles from './CalificarTurno.module.css';
import Toast, { useToast } from '../Toast/Toast';

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
};

type Turno = {
  id: number;
  estado: 'AGENDADO' | 'COMPLETADO';
  fechaHora: string;
  mascota: { id: number; nombre: string };
  veterinario: Veterinario;
};

const CalificarTurno: React.FC = () => {
  const { turnoId } = useParams<{ turnoId: string }>();
  const navigate = useNavigate();
  const [turno, setTurno] = useState<Turno | null>(null);
  const [puntuacion, setPuntuacion] = useState<number>(0);
  const [hovered, setHovered] = useState<number>(0);
  const [comentario, setComentario] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();

  useEffect(() => {
    const fetchTurno = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(
          `/turno/${turnoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTurno(response.data.data);
      } catch (err) {
        setError('No se pudo cargar el turno.');
      } finally {
        setLoading(false);
      }
    };

    if (turnoId) fetchTurno();
    else setError('ID de turno no válido');
  }, [turnoId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (puntuacion < 1 || puntuacion > 5) {
      setError('Debés seleccionar una puntuación entre 1 y 5 estrellas.');
      return;
    }

    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) { setError('Usuario no encontrado.'); return; }
    if (!turno) { setError('Turno no encontrado.'); return; }
    if (!turnoId) { setError('ID de turno no válido.'); return; }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post(
        '/calificacion',
        {
          veterinarioId: turno.veterinario.id,
          usuarioId,
          turnoId: parseInt(turnoId, 10),
          puntuacion,
          comentario: comentario.trim() || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addToast('¡Calificación enviada exitosamente!', 'success');
      setTimeout(() => navigate('/Turnos'), 1500);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'No se pudo enviar la calificación.';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const starLabels = ['', 'Muy malo', 'Malo', 'Regular', 'Bueno', '¡Excelente!'];
  const activeRating = hovered || puntuacion;

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}>
          <div className={styles.skeletonTitle} />
          <div className={styles.skeletonLine} style={{ width: '60%' }} />
          <div className={styles.skeletonStars} />
          <div className={styles.skeletonLine} style={{ width: '100%', height: '90px' }} />
          <div className={styles.skeletonLine} style={{ width: '100%', height: '46px' }} />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast toasts={toasts} onRemove={removeToast} />
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.headerIcon}>⭐</span>
          <h1 className={styles.title}>Calificar atención</h1>
        </div>

        {turno && (
          <div className={styles.turnoInfo}>
            <div className={styles.turnoRow}>
              <span className={styles.turnoLabel}>Veterinario</span>
              <span className={styles.turnoValue}>
                Dr. {turno.veterinario.nombre} {turno.veterinario.apellido}
              </span>
            </div>
            <div className={styles.turnoRow}>
              <span className={styles.turnoLabel}>Mascota</span>
              <span className={styles.turnoValue}>🐾 {turno.mascota.nombre}</span>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.errorBox}>⚠️ {error}</div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Estrellas interactivas */}
          <div className={styles.starsSection}>
            <label className={styles.label}>Tu puntuación</label>
            <div className={styles.starRow}>
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  className={`${styles.starBtn} ${activeRating >= val ? styles.starActive : ''}`}
                  onClick={() => setPuntuacion(val)}
                  onMouseEnter={() => setHovered(val)}
                  onMouseLeave={() => setHovered(0)}
                  aria-label={`${val} estrellas`}
                >
                  ★
                </button>
              ))}
            </div>
            <div className={styles.starLabel}>
              {activeRating > 0 ? starLabels[activeRating] : 'Seleccioná tu puntuación'}
            </div>
          </div>

          {/* Comentario */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="comentario">
              Reseña <span className={styles.optional}>(opcional)</span>
            </label>
            <textarea
              id="comentario"
              className={styles.textarea}
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Contanos tu experiencia con el veterinario..."
            />
            <div className={styles.charCount}>{comentario.length}/500</div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={submitting || puntuacion === 0}
          >
            {submitting ? 'Enviando...' : 'Enviar calificación'}
          </button>

          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate('/Turnos')}
            disabled={submitting}
          >
            Cancelar
          </button>
        </form>
      </div>
    </>
  );
};

export default CalificarTurno;
