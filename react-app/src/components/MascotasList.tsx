import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type Usuario = {
  id: number;
  nombre: string;
};

type Tipo = {
  id: number;
  nombre: string;
};

type Mascota = {
  id: number;
  nombre: string;
  fechaNacimiento: string;
  usuario: Usuario;
  tipo: Tipo; // Asegúrate de que el tipo esté incluido
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

        setMascotas(response.data.data);
      } catch (err) {
        setError('Error al obtener las mascotas');
      }
    };

    fetchMascotas();
  }, []);

  const handleAddMascota = () => {
    navigate('/AddMascota');
  };

  return (
    <div>
      <h2>Tus Mascotas</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mascotas.length === 0 ? (
        <p>No has ingresado ninguna mascota aún.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Nombre
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>
                Fecha de Nacimiento
              </th>
              <th style={{ border: '1px solid #ccc', padding: '8px' }}>Tipo</th>{' '}
              {/* Columna para Tipo */}
            </tr>
          </thead>
          <tbody>
            {mascotas.map((mascota) => (
              <tr key={mascota.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {mascota.nombre}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {mascota.fechaNacimiento}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {mascota.tipo.nombre}
                </td>{' '}
                {/* Mostrar el tipo */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={handleAddMascota}>Agregar nueva mascota</button>
    </div>
  );
};

export default MascotasList;
