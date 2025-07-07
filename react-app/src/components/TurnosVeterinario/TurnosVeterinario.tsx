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

        const response = await axios.get('http://localhost:3000/api/turno', {
          headers: { Authorization: `Bearer ${token}` },
          params: { veterinarioId },
        });

        const turnos = response.data.data.map(
          (turno: TurnoBackend): Turno => ({
            id: turno.id,
            estado: turno.estado,
            fechaHora: turno.fechaHora,
            mascota: { id: turno.mascota.id, nombre: turno.mascota.nombre }, // Asignamos el objeto completo
            veterinario: turno.veterinario.id,
            usuario: { id: turno.usuario.id, nombre: turno.usuario.nombre }, // Asignamos el objeto completo
          })
        );

        const now = new Date();

        const proximos = turnos.filter(
          (turno: Turno) =>
            !turno.estado.includes('COMPLETADO') &&
            new Date(turno.fechaHora) >= now
        );

        const atendidos = turnos.filter(
          (turno: Turno) =>
            turno.estado.includes('COMPLETADO') ||
            new Date(turno.fechaHora) < now
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
    navigate(`/completar-atencion/${turnoId}`);
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
    <h1 className={styles.turnosTitle}>Turnos del Veterinario</h1>
    <div className={styles.turnosGrid}>
      <div className={`${styles.turnosColumn} ${styles.proximos}`}>
        <h2>Próximos Turnos</h2>
        {turnosProximos.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.turnosTable}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Estado</th>
                  <th>Fecha y Hora</th>
                  <th>Mascota</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {turnosProximos.map((turno) => (
                  <tr key={turno.id}>
                    <td>{turno.id}</td>
                    <td>{turno.estado}</td>
                    <td>{turno.fechaHora}</td>
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
                  <th>Estado</th>
                  <th>Fecha y Hora</th>
                  <th>Mascota</th>
                  <th>Usuario</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {turnosAtendidos.map((turno) => (
                  <tr key={turno.id}>
                    <td>{turno.id}</td>
                    <td>{turno.estado}</td>
                    <td>{turno.fechaHora}</td>
                    <td>{turno.mascota?.nombre}</td>
                    <td>{turno.usuario?.nombre}</td>
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
