import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CalificarTurno.module.css';

// Definimos los tipos de datos esperados
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
  const { turnoId } = useParams<{ turnoId: string }>(); // Captura el ID del turno desde la URL
  const navigate = useNavigate();
  const [turno, setTurno] = useState<Turno | null>(null); // Almacenar los detalles del turno
  const [puntuacion, setPuntuacion] = useState<number>(0); // Puntuación seleccionada
  const [comentario, setComentario] = useState<string>(''); // Comentario opcional
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el detalle del turno desde el backend para asegurar que es válido
    const fetchTurno = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `http://localhost:3000/api/turno/${turnoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTurno(response.data.data);
      } catch (err) {
        setError('No se pudo cargar el turno.');
      }
    };

    if (turnoId) {
      fetchTurno();
    } else {
      setError('ID de turno no válido');
    }
  }, [turnoId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // <-- Esto previene el refresh del form

    if (puntuacion < 1 || puntuacion > 5) {
      setError('La puntuación debe estar entre 1 y 5.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId');
      if (!usuarioId) {
        setError('Usuario no encontrado.');
        return;
      }

      if (!turno) {
        setError('Turno no encontrado.');
        return;
      }

      if (turnoId) {
        await axios.post(
          'http://localhost:3000/api/calificacion',
          {
            veterinarioId: turno.veterinario.id,
            usuarioId: usuarioId,
            turnoId: parseInt(turnoId, 10),
            puntuacion,
            comentario,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        navigate('/Turnos');
      } else {
        setError('ID de turno no válido.');
      }
    } catch (err) {
      setError('No se pudo enviar la calificación.');
    }
  };

  return (
  <div className={styles.calificarContainer}>
  <h2>Calificar Turno</h2>
  {error && <p className={styles.errorMessage}>{error}</p>}
  <form onSubmit={handleSubmit}>
    <label>Calificación</label>
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => {
        const value = index + 1; // estrellas enteras
        return (
          <span
            key={index}
            className={`${styles.star} ${puntuacion >= value ? styles.filled : ""}`}
            onClick={() => setPuntuacion(value)}
          >
            ★
          </span>
        );
      })}
    </div>
    <label>Comentario</label>
    <textarea
      value={comentario}
      onChange={(e) => setComentario(e.target.value)}
      rows={4}
      placeholder="Escribe un comentario sobre tu turno..."
    />

    <button type="submit">Enviar Calificación</button>
  </form>
</div>
);
};

export default CalificarTurno;
