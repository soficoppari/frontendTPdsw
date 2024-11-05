import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Menu from './Menu';

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
        // Aquí hacemos la solicitud al endpoint correcto, pasando el usuarioId como query parameter
        const response = await axios.get(`http://localhost:3000/api/turno`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { usuarioId: usuarioId }, // Enviamos el usuarioId como un parámetro
        });

        // Verifica el formato de la respuesta en la consola
        console.log('Respuesta completa de la API:', response.data);

        // Verifica si la respuesta contiene los turnos
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
                    {new Date(turno.fechaHora).toLocaleString('es-ES')}
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
