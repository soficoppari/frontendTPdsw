import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Usuario = {
  id: number;
  nombre: string;
};

type Mascota = {
  id: number;
  nombre: string;
  fechaNacimiento: string;
  usuario: Usuario;
};

const MascotasList: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.get('http://localhost:3000/api/mascota', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Verificar que la respuesta es un array
        if (Array.isArray(response.data)) {
          setMascotas(response.data);
        } else {
          setError('Datos de mascotas no válidos.');
        }
      } catch (err) {
        setError('No se pudieron cargar las mascotas.');
      }
    };

    fetchMascotas();
  }, []);

  const handleAddMascota = () => {
    navigate('/AddMascota');
  };

  return (
    <div>
      <h2>Listado de Mascotas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mascotas.length === 0 ? (
        <p>No has ingresado ninguna mascota aún.</p>
      ) : (
        <ul>
          {mascotas.map((mascota) => (
            <li key={mascota.id}>
              {mascota.nombre} - {mascota.fechaNacimiento}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleAddMascota}>Agregar nueva mascota</button>
    </div>
  );
};

export default MascotasList;
