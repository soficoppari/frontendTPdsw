import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './TurnosVeterinario.module.css';


interface Turno {
  id: number;
  estado: string;
  fechaHora: string;
  mascota: {
    id: number;
    nombre: string; // Ahora la mascota tiene un campo 'nombre'
  };
  veterinario: number; // Si no necesitas mostrar el veterinario, puedes dejar solo el ID
  usuario: {
    id: number;
    nombre: string; // Ahora el usuario tiene un campo 'nombre'
    apellido: string; // <-- agrega apellido aquí
  };
}

interface TurnoBackend {
  id: number;
  estado: string;
  fechaHora: string;
  mascota: {
    id: number;
    nombre: string; // Asegúrate de que mascota tenga un campo "nombre"
  };
  veterinario: { id: number };
  usuario: {
    id: number;
    nombre: string; // Asegúrate de que usuario tenga un campo "nombre"
    apellido: string; // <-- agrega apellido aquí
  };
}

const TurnosVeterinario: React.FC = () => {
  const [turnosProximos, setTurnosProximos] = useState<Turno[]>([]);
  const [turnosAtendidos, setTurnosAtendidos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const token = localStorage.getItem('token');
        const veterinarioId = localStorage.getItem('veterinarioId');

        if (!veterinarioId) {
          setError('Usuario no encontrado');
          return;
        }

        const response = await axios.get('https://backendtpdsw-production-c234.up.railway.app/api/turno', {
          headers: { Authorization: `Bearer ${token}` },
          params: { veterinarioId },
        });
        console.log('Respuesta de la API:', response.data);

        const turnosRaw = Array.isArray(response.data.data)
          ? response.data.data
          : [];

        console.log('Turnos recibidos del backend:', turnosRaw);

        const turnos = turnosRaw.map(
          (turno: TurnoBackend): Turno => ({
            id: turno.id,
            estado: turno.estado,
            fechaHora: turno.fechaHora,
            mascota: turno.mascota
              ? { id: turno.mascota.id, nombre: turno.mascota.nombre }
              : { id: 0, nombre: 'Sin mascota' },
            veterinario: turno.veterinario && typeof turno.veterinario === 'object'
              ? turno.veterinario.id
              : 0,
            usuario: turno.usuario
              ? { id: turno.usuario.id, nombre: turno.usuario.nombre, apellido: turno.usuario.apellido }
              : { id: 0, nombre: 'Sin usuario', apellido: '' },
          })
        );

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

        // Próximos: AGENDADO + fecha futura, orden ascendente (más próximo primero)
        const proximos = turnos
          .filter(
            (turno: Turno) =>
              turno.estado === 'AGENDADO' &&
              Date.parse(turno.fechaHora) >= nowUTC
          )
          .sort(
            (a: Turno, b: Turno) => Date.parse(a.fechaHora) - Date.parse(b.fechaHora)
          );

        // Atendidos: COMPLETADO, O AGENDADO con fecha pasada (ya ocurrió pero sin marcar)
        const atendidos = turnos
          .filter(
            (turno: Turno) =>
              turno.estado === 'COMPLETADO' ||
              (turno.estado === 'AGENDADO' && Date.parse(turno.fechaHora) < nowUTC)
          )
          .sort(
            (a: Turno, b: Turno) => Date.parse(b.fechaHora) - Date.parse(a.fechaHora)
          );

        setTurnosProximos(proximos);
        setTurnosAtendidos(atendidos);
      } catch (err) {
        setError(
          'No se pudieron recuperar los turnos. Intente nuevamente más tarde.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  const completarAtencion = (turnoId: number) => {
    navigate(`/CompletarAtencion/${turnoId}`);
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

  if (loading) {
    return <p className="loading">Cargando turnos...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  console.log(turnosAtendidos);

  return (
    <div className={styles.turnosContainer}>
      <h1 className={styles.turnosTitle}>Tus Turnos</h1>
      <div className={styles.turnosGrid}>
        <div className={`${styles.turnosColumn} ${styles.proximos}`}>
          <h2>Próximos Turnos</h2>
          {turnosProximos.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.turnosTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha y Hora</th>
                    <th>Mascota</th>
                    <th>Dueño</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosProximos.map((turno) => (
                    <tr key={turno.id}>
                      <td>
                        <span className={styles.idBadge}>#{turno.id}</span>
                      </td>
                      <td>
                        {formatFechaHoraBonitaUTC(turno.fechaHora)}
                      </td>
                      <td>{turno.mascota?.nombre}</td>
                      <td>{turno.usuario?.nombre}</td>
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
          <h2>Turnos Atendidos</h2>
          {turnosAtendidos.length > 0 ? (
            <div className={styles.tableWrapper}>
              <table className={styles.turnosTable}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha y Hora</th>
                    <th>Mascota</th>
                    <th>Dueño</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {turnosAtendidos.map((turno) => (
                    <tr key={turno.id}>
                      <td>
                        <span className={styles.idBadge}>#{turno.id}</span>
                      </td>
                      <td>
                        {formatFechaHoraBonitaUTC(turno.fechaHora)}
                      </td>
                      <td>{turno.mascota?.nombre}</td>
                      <td>
                        {turno.usuario
                          ? `${turno.usuario.nombre} ${turno.usuario.apellido}`
                          : 'Sin usuario'}
                      </td>
                      <td>
                        <button
                          className={styles.completarBtn}
                          onClick={() => completarAtencion(turno.id)}
                          disabled={turno.estado.includes('COMPLETADO')}
                        >
                          Completar Atención
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={styles.noTurnos}>No hay turnos atendidos.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TurnosVeterinario;
