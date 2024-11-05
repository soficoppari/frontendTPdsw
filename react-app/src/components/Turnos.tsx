import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Menu from './Menu';
import dayjs from 'dayjs'; // Usamos dayjs para manejar las fechas

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

type Turno = {
  id: number;
  estado: boolean;
  fechaHora: string;
  mascota: Mascota;
  veterinario: Veterinario;
};

const Turnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]); // Estado para los turnos
  const [error, setError] = useState<string>(''); // Estado para el mensaje de error

  useEffect(() => {
    const fetchTurnos = async () => {
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId'); // Asegúrate de tener el usuarioId en localStorage

      if (!usuarioId) {
        setError('Usuario no encontrado');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3000/api/turno`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { usuarioId: usuarioId }, // Enviamos el usuarioId como un parámetro
        });

        // Verifica el formato de la respuesta en la consola
        console.log('Respuesta completa de la API:', response.data);

        const turnosData = Array.isArray(response.data.data)
          ? response.data.data // Si ya es un array, lo usamos tal cual
          : [response.data.data]; // Si es un objeto único, lo metemos en un array

        console.log('Datos de los turnos:', turnosData);
        setTurnos(turnosData); // Asigna los turnos al estado
      } catch (err) {
        console.error('Error al obtener los turnos:', err);
        setError('Error al obtener los turnos');
      }
    };

    fetchTurnos();
  }, []); // Solo se ejecuta una vez al cargar el componente

  // Verifica el estado de los turnos
  console.log('Turnos en el estado:', turnos);

  // Función para eliminar un turno
  const deleteTurno = async (turnoId: number) => {
    const token = localStorage.getItem('token');

    try {
      await axios.delete(`http://localhost:3000/api/turno/${turnoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Actualizar el estado eliminando el turno borrado
      setTurnos((prevTurnos) =>
        prevTurnos.filter((turno) => turno.id !== turnoId)
      );
    } catch (err) {
      console.error('Error al eliminar el turno:', err);
      setError('No se pudo eliminar el turno');
    }
  };

  // Función para convertir la fecha a un formato que JavaScript entienda
  const formatDate = (dateStr: string) => {
    // Reemplazamos AM/PM por un formato adecuado para JavaScript
    // Ejemplo: '2024-11-06T02:00 PM' -> '2024-11-06T14:00:00'
    const formattedDate = dateStr.replace(
      /(\d{4}-\d{2}-\d{2}T)(\d{1,2}):(\d{2}) (\w{2})/,
      (p1, p2, p3, p4) => {
        let hour = parseInt(p2);
        if (p4 === 'PM' && hour < 12) hour += 12; // Si es PM y la hora es menor a 12, sumamos 12
        if (p4 === 'AM' && hour === 12) hour = 0; // Si es AM y la hora es 12, cambiamos a 00
        return `${p1}${hour}:${p3}:00`;
      }
    );

    // Retornamos el formato corregido
    return formattedDate;
  };

  return (
    <>
      <Menu />
      <div>
        <h2>Tus Turnos</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}{' '}
        {/* Muestra mensaje de error */}
        {turnos.length === 0 ? (
          <p>No tienes turnos agendados.</p> // Si no hay turnos, muestra este mensaje
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                  Nombre de la Mascota
                </th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                  Veterinario
                </th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                  Fecha y Hora
                </th>
              </tr>
            </thead>
            <tbody>
              {turnos.map((turno) => (
                <tr key={turno.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {turno.mascota.nombre}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {turno.veterinario.nombre} {turno.veterinario.apellido}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                    {dayjs(formatDate(turno.fechaHora)).format(
                      'DD/MM/YYYY HH:mm'
                    )}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      color: 'red',
                    }}
                  >
                    <button onClick={() => deleteTurno(turno.id)}>
                      Eliminar Turno
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default Turnos;
