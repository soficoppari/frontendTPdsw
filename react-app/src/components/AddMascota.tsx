import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMascota: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [tipoId, setTipoId] = useState<number | null>(null); // Para el tipo de mascota
  const [tipos, setTipos] = useState<{ id: number; nombre: string }[]>([]); // Lista de tipos
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/tipo'); // Cambia esta URL según tu API
        setTipos(response.data.data);
      } catch (err) {
        setError('Error al cargar los tipos de mascotas');
      }
    };

    fetchTipos();
  }, []);

  const handleAddMascota = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId');

      if (!token || !usuarioId) {
        setError('No se encontró un usuario autenticado.');
        return;
      }

      // Hacer la petición al backend para agregar la mascota
      await axios.post(
        'http://localhost:3000/api/mascota',
        { nombre, fechaNacimiento, usuarioId, tipoId }, // Aquí agregamos el tipoId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mascota agregada con éxito, redirige a la lista de mascotas
      setSuccess('Mascota agregada');
      navigate('/MascotasList');
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div>
      <h2>Agregar Mascota</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleAddMascota}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Tipo:</label>
          <select
            value={tipoId ?? ''}
            onChange={(e) => setTipoId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Selecciona un tipo
            </option>
            {tipos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Agregar Mascota</button>
      </form>
    </div>
  );
};

export default AddMascota;
