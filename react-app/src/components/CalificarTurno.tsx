import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  const handleSubmit = async () => {
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

      // Verificar que el turno está completo
      if (!turno) {
        setError('Turno no encontrado.');
        return;
      }

      // Verificar que turnoId está definido y convertirlo a número
      if (turnoId) {
        // Enviar la calificación al backend
        await axios.post(
          'http://localhost:3000/api/calificacion',
          {
            veterinarioId: turno.veterinario.id, // Asegurarse de que estamos enviando el ID del veterinario
            usuarioId,
            turnoId: parseInt(turnoId, 10), // Aquí aseguramos que turnoId es un string y lo convertimos a entero
            puntuacion,
            comentario,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        navigate('/Turnos'); // Navegar a la lista de turnos después de calificar
      } else {
        setError('ID de turno no válido.');
      }
    } catch (err) {
      setError('No se pudo enviar la calificación.');
    }
  };

  return (
    <div>
      <h2>Calificar Turno</h2>
      {error && <p className="error">{error}</p>}
      {turno ? (
        <div>
          <p>Veterinario: {turno.veterinario.nombre}</p>
          <p>Fecha y Hora: {turno.fechaHora}</p>

          <div>
            <label>Puntuación (1-5):</label>
            <input
              type="number"
              value={puntuacion}
              onChange={(e) => setPuntuacion(Number(e.target.value))}
              min="1"
              max="5"
            />
          </div>

          <div>
            <label>Comentario:</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Deja un comentario opcional"
            />
          </div>

          <button onClick={handleSubmit}>Enviar Calificación</button>
        </div>
      ) : (
        <p>Cargando detalles del turno...</p>
      )}
    </div>
  );
};

export default CalificarTurno;
