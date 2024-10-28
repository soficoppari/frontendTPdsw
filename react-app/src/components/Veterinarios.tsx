import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Horario = {
  id: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
};

type Turno = {
  id: number;
  horario: Horario;
  estado: boolean;
};

type Tipo = {
  id: number;
  nombre: string;
};

type Veterinario = {
  id: number;
  nombre: string;
  direccion: string;
  nroTelefono: number;
  horarios: Horario[];
  turnos: Turno[];
  tipos: Tipo[];
};

const VeterinariosList: React.FC = () => {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const tipoMascota = localStorage.getItem('tipoMascota');

    const fetchVeterinarios = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/veterinario',
          {
            params: { tipoMascota },
          }
        );

        // Verificar si la respuesta contiene los datos esperados
        const data = response.data?.data;
        setVeterinarios(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al obtener las Veterinarios');
      }
    };

    fetchVeterinarios();
  }, []);

  const handleVeterinarioClick = (id: number) => {
    navigate(`/veterinario/${id}`);
  };

  return (
    <div>
      <h1>Lista de Veterinarios</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {veterinarios.length === 0 ? (
        <p>No hay veterinarios disponibles.</p>
      ) : (
        <ul>
          {veterinarios.map((veterinario) => (
            <li
              key={veterinario.id}
              onClick={() => handleVeterinarioClick(veterinario.id)}
            >
              <h2>{veterinario.nombre}</h2>
              <p>Dirección: {veterinario.direccion}</p>
              <p>Número de Teléfono: {veterinario.nroTelefono}</p>
              <p>
                Tipos de servicio:{' '}
                {veterinario.tipos.map((tipo) => tipo.nombre).join(', ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VeterinariosList;
