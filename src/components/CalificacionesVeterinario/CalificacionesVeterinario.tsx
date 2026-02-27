import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import styles from './CalificacionesVeterinario.module.css';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';

interface DecodedToken {
  id: number;
}

interface Calificacion {
  id: number;
  puntuacion: number;
  comentario?: string | null;
  fecha: string;
}

const RatingStars = ({ value, max = 5, size = 'md' }: { value: number; max?: number; size?: 'sm' | 'md' | 'lg' }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} className={`${styles.star} ${styles[`star_${size}`]}`} />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className={`${styles.star} ${styles[`star_${size}`]}`} />);
    } else {
      stars.push(<FaRegStar key={i} className={`${styles.starEmpty} ${styles[`star_${size}`]}`} />);
    }
  }
  return <span className={styles.starsRow}>{stars}</span>;
};

const SkeletonCard = () => (
  <div className={styles.reviewSkeleton}>
    <div className={styles.skeletonLine} style={{ width: '30%' }} />
    <div className={styles.skeletonLine} style={{ width: '55%' }} />
    <div className={styles.skeletonLine} style={{ width: '80%' }} />
  </div>
);

const CalificacionesVeterinario: React.FC = () => {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalificaciones = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (!decoded?.id) {
          setError('Token no válido');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://backendtpdswproduction7bb3.up.railway.app/api/veterinario/${decoded.id}/calificaciones`
        );

        setCalificaciones(response.data.calificaciones);
        setPromedio(response.data.promedio);
      } catch (err) {
        setError('Error al cargar las calificaciones');
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, []);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Distribución de estrellas para el gráfico
  const distribucion = [5, 4, 3, 2, 1].map((n) => ({
    valor: n,
    cantidad: calificaciones.filter((c) => Math.round(c.puntuacion) === n).length,
  }));
  const maxDist = Math.max(...distribucion.map((d) => d.cantidad), 1);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Mis Calificaciones</h1>

      {/* ---- Resumen promedio ---- */}
      {loading ? (
        <div className={styles.promedioSkeleton}>
          <div className={styles.skeletonNum} />
          <div className={styles.skeletonLine} style={{ width: '120px' }} />
        </div>
      ) : error ? (
        <div className={styles.errorBox}>⚠️ {error}</div>
      ) : promedio !== null ? (
        <div className={styles.promedioCard}>
          <div className={styles.promedioLeft}>
            <div className={styles.promedioNum}>{promedio.toFixed(1)}</div>
            <RatingStars value={promedio} size="lg" />
            <div className={styles.totalReviews}>
              {calificaciones.length} {calificaciones.length === 1 ? 'calificación' : 'calificaciones'}
            </div>
          </div>
          <div className={styles.promedioRight}>
            {distribucion.map((d) => (
              <div key={d.valor} className={styles.distRow}>
                <span className={styles.distNum}>{d.valor}</span>
                <FaStar className={styles.distStar} />
                <div className={styles.distBar}>
                  <div
                    className={styles.distFill}
                    style={{ width: `${(d.cantidad / maxDist) * 100}%` }}
                  />
                </div>
                <span className={styles.distCount}>{d.cantidad}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.emptyPromedio}>
          <span>⭐</span>
          <p>Todavía no tenés calificaciones</p>
          <span className={styles.emptyHint}>Tus pacientes podrán calificarte después de cada atención</span>
        </div>
      )}

      {/* ---- Lista de reseñas ---- */}
      {!loading && calificaciones.length > 0 && (
        <div className={styles.reviewsSection}>
          <h2 className={styles.reviewsTitle}>Reseñas recibidas</h2>
          <div className={styles.reviewsList}>
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : (
              calificaciones.map((cal) => (
                <div key={cal.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <FaUserCircle className={styles.reviewAvatar} />
                    <div className={styles.reviewMeta}>
                      <RatingStars value={cal.puntuacion} size="sm" />
                      <span className={styles.reviewFecha}>{formatFecha(cal.fecha)}</span>
                    </div>
                  </div>
                  {cal.comentario && (
                    <p className={styles.reviewComentario}>"{cal.comentario}"</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalificacionesVeterinario;
