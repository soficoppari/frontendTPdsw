import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AddMascota.module.css';

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
    <div className={styles.container}>
      <h2 className={styles.title}>Agregar Mascota</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form className={styles.form} onSubmit={handleAddMascota}>
        <div className={styles.formGroup}>
          <label className={styles.label} style={{ alignSelf: 'flex-start' }}>Nombre:</label>
          <input
            type="text"
            className={styles.input}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ alignSelf: 'flex-start' }}>Fecha de Nacimiento:</label>
          <input
            type="date"
            className={styles.input}
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            required
            max={new Date().toISOString().split('T')[0]}
            // El input type="date" siempre muestra el formato local del navegador,
            // pero para mostrarlo como dd/mm/aaaa debajo, puedes agregar esto:
          />
          {fechaNacimiento && (
            <span className={styles.fechaFormateada}>
              {(() => {
                const meses = [
                  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                ];
                const [y, m, d] = fechaNacimiento.split('-');
                const mesTexto = meses[parseInt(m, 10) - 1];
                return `${parseInt(d, 10)} de ${mesTexto}, ${y}`;
              })()}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ alignSelf: 'flex-start' }}>Especie:</label>
          <select
            className={styles.select}
            value={especieId ?? ''}
            onChange={(e) => setEspecieId(Number(e.target.value))}
            required
          >
            <option value="" disabled>Selecciona una Especie</option>
            {especies.map((especie) => (
              <option key={especie.id} value={especie.id}>{especie.nombre}</option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} style={{ alignSelf: 'flex-start' }}>Raza:</label>
          <select
            className={styles.select}
            value={razaId ?? ''}
            onChange={(e) => setRazaId(Number(e.target.value))}
            required
            disabled={!especieId}
          >
            <option value="" disabled>Selecciona una Raza</option>
            {razas.map((raza) => (
              <option key={raza.id} value={raza.id}>{raza.nombre}</option>
            ))}
          </select>
        </div>

        <button className={styles.submitButton} type="submit">Agregar Mascota</button>
      </form>
    </div>
  );
};

export default AddMascota;
