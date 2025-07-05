import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation
import dayjs from 'dayjs';
import styles from './Turnos.module.css';


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
  estado: 'AGENDADO' | 'COMPLETADO';
  fechaHora: string;
  mascota: Mascota;
  veterinario: Veterinario;
  calificacion?: Calificacion | null;
};

const Turnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchTurnos = async () => {
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      setError('Usuario no encontrado');
      return;
    }

    try {
      console.log('Fetching turnos for usuarioId:', usuarioId); // Log usuarioId
      const response = await axios.get('http://localhost:3000/api/turno', {
        headers: { Authorization: `Bearer ${token}` },
        params: { usuarioId: usuarioId },
      });

      console.log('Response from API:', response.data); // Log completa de la API
      const turnosData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      setTurnos(turnosData);
    } catch (err) {
      console.error('Error al obtener los turnos:', err);
      setError('Error al obtener los turnos');
    }
  };

  useEffect(() => {
    fetchTurnos(); // Carga inicial
  }, [location]);

  const deleteTurno = async (turnoId: number) => {
    const token = localStorage.getItem('token');

    try {
      console.log('Deleting turno with ID:', turnoId); // Log ID del turno a eliminar
      await axios.delete(`http://localhost:3000/api/turno/${turnoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Turno eliminado. Refrescando lista...');
      await fetchTurnos();
    } catch (err) {
      console.error('Error al eliminar el turno:', err);
      setError('No se pudo eliminar el turno');
    }
  };

  const handleCalificar = (turnoId: number) => {
    console.log('Navigating to calificar turno for ID:', turnoId); // Log del ID del turno
    navigate(`/CalificarTurno/${turnoId}`);
  };

  return (
  <div className={styles.container}>
    <h2 className={styles.title}>Tus Turnos</h2>
    {error && <p className={styles.error}>{error}</p>}
    {turnos.length === 0 ? (
      <p>No tienes turnos agendados.</p>
    ) : (
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre de la Mascota</th>
            <th>Veterinario</th>
            <th>Fecha y Hora</th>
            <th>Calificación</th>
          </tr>
        </thead>
        <tbody>
          {turnos.map((turno) => (
            <tr key={turno.id}>
              <td>{turno.mascota.nombre}</td>
              <td>{turno.veterinario.nombre} {turno.veterinario.apellido}</td>
              <td>{dayjs(turno.fechaHora).format('DD/MM/YYYY HH:mm')}</td>
              <td>
                {turno.calificacion ? (
                  <span>{turno.calificacion.puntuacion}</span>
                ) : turno.estado === 'COMPLETADO' ? (
                  <button className={styles.actionButton} onClick={() => handleCalificar(turno.id)}>
                    Calificar Turno
                  </button>
                ) : turno.estado === 'AGENDADO' ? (
                  <button className={styles.actionButton} onClick={() => deleteTurno(turno.id)}>
                    Cancelar Turno
                  </button>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
);
};

export default Turnos;
