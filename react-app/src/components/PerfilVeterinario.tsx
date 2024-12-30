import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

interface Veterinario {
  id: number;
  matricula: number;
  nombre: string;
  apellido: string;
  direccion: string;
  nroTelefono: number;
  email: string;
}

interface DecodedToken {
  id: number; // Ajusta según sea necesario
}

const PerfilVeterinario: React.FC = () => {
  const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVeterinario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      // Decodificar el token para obtener el ID del veterinario
      const decoded = jwtDecode<DecodedToken>(token); // Usar jwtDecode

      if (!decoded || !decoded.id) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      const veterinarioId = decoded.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/veterinario/${veterinarioId}`
        );
        setVeterinario(response.data.data); // Ajusta según la estructura de tu respuesta
      } catch (err) {
        setError('Error al cargar los datos del veterinario');
      } finally {
        setLoading(false);
      }
    };

    fetchVeterinario();
  }, []);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="perfil-container">
      {veterinario ? (
        <>
          <h1 className="perfil-title">
            {veterinario.nombre} {veterinario.apellido}
          </h1>
          <div className="perfil-info">
            <p>
              <span className="perfil-label">Matrícula:</span>{' '}
              {veterinario.matricula}
            </p>
            <p>
              <span className="perfil-label">Dirección:</span>{' '}
              {veterinario.direccion}
            </p>
            <p>
              <span className="perfil-label">Teléfono:</span>{' '}
              {veterinario.nroTelefono}
            </p>
            <p>
              <span className="perfil-label">Email:</span> {veterinario.email}
            </p>
          </div>
        </>
      ) : (
        <p className="perfil-loading">Cargando datos...</p>
      )}
    </div>
  );
};

export default PerfilVeterinario;
