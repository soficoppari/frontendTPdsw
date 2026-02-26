import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ResumenTurno.module.css';

type Mascota = {
  id: number;
  nombre: string;
  especie: string;
};

type Veterinario = {
  id: number;
  nombre: string;
  apellido: string;
};

type Calificacion = {
  id: number;
  puntuacion: number;
  comentario?: string | null;
};

type Turno = {
  id: number;
  fechaHora: string;
  mascota: Mascota;
  veterinario: Veterinario | null;
  observaciones?: string | null;
  calificacion?: Calificacion | null;
};

const especieIcono: Record<string, string> = {
  perro: '🐶',
  gato: '🐱',
  ave: '🐦',
};

const ResumenTurno: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [turno, setTurno] = useState<Turno | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurno = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/api/turno/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurno(response.data.data);
      } catch {
        setError('No se pudo cargar el resumen del turno');
      }
    };
    fetchTurno();
  }, [id]);

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

  const renderStars = (puntuacion: number) =>
    [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < puntuacion ? '#fbbf24' : 'rgba(255,255,255,0.2)', fontSize: '1.15rem' }}>
        ★
      </span>
    ));

  if (error) return (
    <div className={styles['resumen-container']}>
      <div className={styles.errorBox}>⚠️ {error}</div>
      <button onClick={() => navigate(-1)} className={styles['resumen-button']}>Volver</button>
    </div>
  );

  if (!turno) return (
    <div className={styles['resumen-container']}>
      <div className={styles.skeleton}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonLine} style={{ width: '60%' }} />
        <div className={styles.skeletonLine} style={{ width: '80%' }} />
        <div className={styles.skeletonLine} style={{ width: '70%' }} />
      </div>
    </div>
  );

  const icono = especieIcono[turno.mascota?.especie?.toLowerCase()] || '🐾';

  return (
    <div className={styles['resumen-container']}>
      {/* Encabezado */}
      <div className={styles.header}>
        <span className={styles.mascotaIcon}>{icono}</span>
        <h1 className={styles['resumen-title']}>
          Turno de {turno.mascota.nombre}
        </h1>
      </div>

      {/* Info principal */}
      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Fecha y hora</span>
          <span className={styles.infoValue}>📅 {formatFechaHoraBonitaUTC(turno.fechaHora)}</span>
        </div>

        {turno.veterinario && (
          <div className={styles.infoCard}>
            <span className={styles.infoLabel}>Veterinario</span>
            <span className={styles.infoValue}>
              👨‍⚕️ Dr. {turno.veterinario.nombre} {turno.veterinario.apellido}
            </span>
          </div>
        )}

        <div className={styles.infoCard}>
          <span className={styles.infoLabel}>Observaciones del veterinario</span>
          <span className={styles.infoValue}>
            {turno.observaciones || <em className={styles.sinDatos}>Sin observaciones</em>}
          </span>
        </div>
      </div>

      {/* Sección de calificación */}
      <div className={styles.calificacionSection}>
        <h2 className={styles.calificacionTitle}>Tu calificación</h2>
        {turno.calificacion ? (
          <>
            <div className={styles.stars}>{renderStars(turno.calificacion.puntuacion)}</div>
            {turno.calificacion.comentario ? (
              <blockquote className={styles.comentario}>
                "{turno.calificacion.comentario}"
              </blockquote>
            ) : (
              <p className={styles.sinDatos}>No dejaste una reseña escrita</p>
            )}
          </>
        ) : (
          <p className={styles.sinDatos}>Todavía no calificaste esta atención</p>
        )}
      </div>

      <button onClick={() => navigate(-1)} className={styles['resumen-button']}>
        ← Volver
      </button>
    </div>
  );
};

export default ResumenTurno;