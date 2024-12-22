import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css'; // Asegúrate de tener estilos básicos para este componente

interface Turno {
  id: number;
  fecha: string;
  hora: string;
  mascota: string;
  cliente: string;
  motivo: string;
}

const TurnosVeterinario: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        // Supongamos que el ID del veterinario está en el token del localStorage
        const token = localStorage.getItem('token');
        const veterinarioId = localStorage.getItem('veterinarioId'); // Asegúrate de tener el veterinarioId en localStorage

        if (!veterinarioId) {
          setError('Usuario no encontrado');
          return;
        }

        // Llamada a la API para recuperar los turnos del veterinario
        const response = await axios.get(`http://localhost:3000/api/turno`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { veterinarioId: veterinarioId }, // Enviamos el veterinarioId como un parámetro
        });

        setTurnos(response.data);
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

  if (loading) {
    return <p className="loading">Cargando turnos...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="turnos-container">
      <h1 className="turnos-title">Turnos del Veterinario</h1>
      {turnos.length > 0 ? (
        <table className="turnos-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Mascota</th>
              <th>Cliente</th>
              <th>Motivo</th>
            </tr>
          </thead>
          <tbody>
            {turnos.map((turno) => (
              <tr key={turno.id}>
                <td>{turno.fecha}</td>
                <td>{turno.hora}</td>
                <td>{turno.mascota}</td>
                <td>{turno.cliente}</td>
                <td>{turno.motivo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="no-turnos">No hay turnos asignados.</p>
      )}
    </div>
  );
};

export default TurnosVeterinario;
