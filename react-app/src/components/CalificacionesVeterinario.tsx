import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu'; // Asegúrate de tener este componente en tu proyecto
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  id: number; // Ajusta según la estructura real de tu token
}

interface Calificacion {
  id: number;
  puntuacion: number;
  comentario: string | null;
  fecha: string;
}

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
    <div className="perfil-container">
      {<Menu />}
      <h1 className="perfil-title">Calificaciones</h1>
      {promedio !== null ? (
        <p className="perfil-info">
          <span className="perfil-label">Promedio de calificaciones:</span>{' '}
          {promedio.toFixed(2)}
        </p>
      ) : (
        <p>No hay calificaciones disponibles.</p>
      )}
      <ul className="perfil-list">
        {calificaciones.map((calificacion) => (
          <li key={calificacion.id} className="perfil-list-item">
            <p>
              <span className="perfil-label">Puntuación:</span>{' '}
              {calificacion.puntuacion}
            </p>
            <p>
              <span className="perfil-label">Fecha:</span>{' '}
              {new Date(calificacion.fecha).toLocaleDateString()}
            </p>
            {calificacion.comentario && (
              <p>
                <span className="perfil-label">Comentario:</span>{' '}
                {calificacion.comentario}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalificacionesVeterinario;
