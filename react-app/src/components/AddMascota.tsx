import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMascota: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleAddMascota = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token'); // Asume que tienes el token guardado en localStorage
      const usuarioId = localStorage.getItem('usuarioId'); // Asume que tienes el ID de usuario guardado

      if (!token || !usuarioId) {
        setError('No se encontró un usuario autenticado.');
        return;
      }

      // Hacer la petición al backend para agregar la mascota
      await axios.post(
        'http://localhost:3000/api/mascota',
        { nombre, fechaNacimiento, usuarioId }, // Aquí agregamos el usuarioId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mascota agregada con éxito, redirige a la lista de mascotas
      setSuccess('mascota agregada');
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
        <button type="submit">Agregar Mascota</button>
      </form>
    </div>
  );
};

export default AddMascota;
//usuarioId
