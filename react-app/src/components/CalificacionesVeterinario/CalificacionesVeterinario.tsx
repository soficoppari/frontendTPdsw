import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import styles from './CalificacionesVeterinario.module.css';
import { FaStar, FaStarHalfAlt, FaRegStar, FaRegCalendarAlt, FaRegCommentDots } from "react-icons/fa";

interface DecodedToken {
  id: number; // Ajusta según la estructura real de tu token
}

interface Calificacion {
  id: number;
  puntuacion: number;
  comentario: string | null;
  fecha: string;
}

type RatingProps = {
  value: number; // promedio, por ejemplo 3.5
  max?: number; // por defecto 5
};

const RatingStars = ({ value, max = 5 }: RatingProps) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} className={styles.starFull} />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className={styles.starHalf} />);
    } else {
      stars.push(<FaRegStar key={i} className={styles.starEmpty} />);
    }
  }
  return <span className={styles.stars}>{stars}</span>;
};

const CalificacionesVeterinario: React.FC = () => {
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [promedio, setPromedio] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        const decoded: DecodedToken = jwtDecode<DecodedToken>(token); // Decodificar el token
        const veterinarioId = decoded.id;

        if (!veterinarioId) {
          setError('Token no válido');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/veterinario/${veterinarioId}/calificaciones`
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

  if (loading) {
    return <p>Cargando calificaciones...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
  <div className={styles.perfilContainer}>
    <h1 className={styles.perfilTitle}>Calificaciones</h1>

    {promedio !== null ? (
      <div className={styles.promedio}>
        <p>
          <span className={styles.perfilLabel}>Promedio de calificaciones:</span>{' '}
          {promedio.toFixed(2)}
        </p>
        {/* Estrellas debajo del promedio */}
        <RatingStars value={promedio} />
      </div>
    ) : (
      <p>No hay calificaciones disponibles.</p>
    )}

    <ul className={styles.perfilList}>
      {calificaciones.map((calificacion) => (
        <li key={calificacion.id} className={styles.perfilListItem}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <span className={styles.perfilLabel}>Puntuación:</span>
            <RatingStars value={calificacion.puntuacion} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.3rem" }}>
            <FaRegCalendarAlt style={{ color: "#4a90e2" }} />
            <span>
              {new Date(calificacion.fecha).toLocaleDateString()}
            </span>
          </div>
          {calificacion.comentario && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <FaRegCommentDots style={{ color: "#4a90e2" }} />
              <span>{calificacion.comentario}</span>
            </div>
          )}
        </li>
      ))}
    </ul>
  </div>
  );
};

export default CalificacionesVeterinario;
