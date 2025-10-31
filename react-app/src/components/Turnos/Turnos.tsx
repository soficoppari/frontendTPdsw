import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Turnos.module.css';

// Componente para mostrar estrellas según la puntuación
const RatingStars = ({ value, max = 5 }: { value: number; max?: number }) => {
  const stars = [];
  for (let i = 1; i <= max; i++) {
    if (value >= i) {
      stars.push(<span key={i} className={styles.star}>★</span>);
    } else if (value >= i - 0.5) {
      stars.push(<span key={i} className={styles.starEmpty}>☆</span>);
    } else {
      stars.push(<span key={i} className={styles.starEmpty}>★</span>);
    }
  }
  return <span>{stars}</span>;
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
      const response = await axios.get('http://localhost:3000/api/turno', {
        headers: { Authorization: `Bearer ${token}` },
        params: { usuarioId: usuarioId },
      });

      const turnosData = Array.isArray(response.data.data)
        ? response.data.data
        : [response.data.data];

      console.log('Turnos recibidos del backend:', turnosData); // <-- LOG AQUÍ

      setTurnos(turnosData);
    } catch (err) {
      setError('Error al obtener los turnos');
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
    } catch (err) {
      setError('No se pudo cancelar el turno');
    }
  };

  // Filtrar turnos
const now = new Date();
const nowUTC = Date.UTC(
  now.getUTCFullYear(),
  now.getUTCMonth(),
  now.getUTCDate(),
  now.getUTCHours(),
  now.getUTCMinutes(),
  now.getUTCSeconds(),
  now.getUTCMilliseconds()
);

const turnosProximos = turnos.filter(
  (turno) =>
    turno.estado === 'AGENDADO' &&
    Date.parse(turno.fechaHora) >= nowUTC
);
const turnosCompletados = turnos.filter(
  (turno) => turno.estado === 'COMPLETADO'
);

// Formato de fecha en UTC
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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tus Turnos</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.turnosGrid}>
        <div className={`${styles.turnosColumn} ${styles.proximos}`}>
          <h2>Próximos Turnos</h2>
          {turnosProximos.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Mascota</th>
                    <th>Veterinario</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosProximos.map((turno) => (
                    <tr key={turno.id}>
                      <td>{formatFechaHoraBonitaUTC(turno.fechaHora)}</td>
                      <td>{turno.mascota.nombre}</td>
                      <td>
                        {turno.veterinario.nombre} {turno.veterinario.apellido}
                      </td>
                      <td>
                        <button
                          className={styles.cancelarBtn}
                          onClick={() => deleteTurno(turno.id)}
                        >
                          Cancelar Turno
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.noTurnos}>No hay turnos próximos.</p>
          )}
        </div>
        <div className={`${styles.turnosColumn} ${styles.atendidos}`}>
          <h2>Atenciones recientes</h2>
          {turnosCompletados.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Fecha y Hora</th>
                    <th>Mascota</th>
                    <th>Veterinario</th>
                    <th>Calificación</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosCompletados.map((turno) => (
                    <tr key={turno.id}>
                      <td>{formatFechaHoraBonitaUTC(turno.fechaHora)}</td>
                      <td>{turno.mascota.nombre}</td>
                      <td>
                        {turno.veterinario.nombre} {turno.veterinario.apellido}
                      </td>
                      <td>
                        {turno.calificacion ? (
                          <RatingStars value={turno.calificacion.puntuacion} />
                        ) : (
                          <button
                            className={styles.calificarBtn}
                            onClick={() => navigate(`/CalificarTurno/${turno.id}`)}
                          >
                            Calificar Turno
                          </button>
                        )}
                      </td>
                      <td>
                        <button
                          className={styles.actionButton}
                          onClick={() => navigate(`/ResumenTurno/${turno.id}`)}
                        >
                          Resumen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.noTurnos}>No hay atenciones recientes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Turnos;
