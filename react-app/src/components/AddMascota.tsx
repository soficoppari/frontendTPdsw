import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu';

const AddMascota: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [razaId, setRazaId] = useState<number | null>(null); // Para el raza de mascota
  const [razas, setRazas] = useState<{ id: number; nombre: string }[]>([]); // Lista de especies
  const [especieId, setEspecieId] = useState<number | null>(null);
  const [especies, setEspecies] = useState<{ id: number; nombre: string }[]>(
    []
  );
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/especie'); // Cambia esta URL según tu API
        setEspecies(response.data.data);
      } catch (err) {
        setError('Error al cargar las especies');
      }
    };

    fetchEspecies();
  }, []);

  useEffect(() => {
    console.log('useEffect disparado con especieId:', especieId);
    const fetchRazas = async () => {
      if (!especieId) {
        setRazas([]);
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:3000/api/raza/especie/${especieId}`
        );

        console.log('Razas obtenidas del servidor:', response.data.data);
        setRazas(response.data.data);
      } catch (err) {
        setError('Error al cargar las razas');
      }
    };

    fetchRazas();
  }, [especieId]);

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
        { nombre, fechaNacimiento, usuarioId, razaId }, // Aquí agregamos el razaId
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Mascota agregada con éxito, redirige a la lista de mascotas
      setSuccess('Mascota agregada');
      navigate('/Mascotas');
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <>
      <Menu />
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
            <label>Especie:</label>
            <select
              value={especieId ?? ''}
              onChange={(e) => {
                const newEspecieId = Number(e.target.value);
                console.log('Nuevo especieId seleccionado:', newEspecieId); // Log para depuración
                setEspecieId(newEspecieId);
              }}
              required
            >
              <option value="" disabled>
                Selecciona una Especie
              </option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Raza:</label>
            <select
              value={razaId ?? ''}
              onChange={(e) => setRazaId(Number(e.target.value))}
              required
              disabled={!especieId} // Deshabilitar si no se ha seleccionado una especie.
            >
              <option value="" disabled>
                Selecciona una Raza
              </option>
              {razas.map((raza) => (
                <option key={raza.id} value={raza.id}>
                  {raza.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Agregar Mascota</button>
        </form>
      </div>
    </>
  );
};

export default AddMascota;
