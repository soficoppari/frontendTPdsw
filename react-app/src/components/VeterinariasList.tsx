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

type Veterinaria = {
  id: number;
  nombre: string;
  direccion: string;
  nroTelefono: number;
  horarios: Horario[];
  turnos: Turno[];
  tipos: Tipo[];
};

const VeterinariasList: React.FC = () => {
  const [veterinarias, setVeterinarias] = useState<Veterinaria[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const tipoMascota = localStorage.getItem('tipoMascota');

    const fetchVeterinarias = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/veterinaria',
          {
            params: { tipoMascota },
          }
        );

        // Verificar si la respuesta contiene los datos esperados
        const data = response.data?.data;
        setVeterinarias(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al obtener las Veterinarias');
      }
    };

    fetchVeterinarias();
  }, []);

  const handleVeterinariaClick = (id: number) => {
    navigate(`/veterinaria/${id}`);
  };

  return (
    <div>
      <h1>Lista de Veterinarias</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {veterinarias.length === 0 ? (
        <p>No hay veterinarias disponibles.</p>
      ) : (
        <ul>
          {veterinarias.map((veterinaria) => (
            <li
              key={veterinaria.id}
              onClick={() => handleVeterinariaClick(veterinaria.id)}
            >
              <h2>{veterinaria.nombre}</h2>
              <p>Dirección: {veterinaria.direccion}</p>
              <p>Número de Teléfono: {veterinaria.nroTelefono}</p>
              <p>
                Tipos de servicio:{' '}
                {veterinaria.tipos.map((tipo) => tipo.nombre).join(', ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VeterinariasList;
