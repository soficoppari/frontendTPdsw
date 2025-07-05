import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Veterinarios.module.css';

type Horario = {
  id: number;
  dia: string;
  horaFin: Date;
  horaInicio: Date;
};

type Turno = {
  id: number;
  horario: Horario;
  estado: boolean;
};

type Especie = {
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
  especies: Especie[];
};

const VeterinariosList: React.FC = () => {
  const [veterinarios, setVeterinarios] = useState<Veterinario[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const especieMascota = localStorage.getItem('especieMascota');
    const especieMascotaId = especieMascota ? Number(especieMascota) : NaN;

    const fetchVeterinarios = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3000/api/veterinario',
          {
            params: { especie: especieMascotaId },
          }
        );

        const data = response.data?.data;
        setVeterinarios(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Error al obtener los veterinarios');
      }
    };

    fetchVeterinarios();
  }, []);

  const handleScheduleClick = (id: number) => {
    // Guardar el ID del veterinario en el localStorage
    localStorage.setItem('veterinarioId', id.toString());
    // Navegar a la página de agendar turno
    navigate(`/AddTurno/${id}`);
  };

  return (
  <div className={styles.container}>
    <h1 className={styles.title}>Lista de Veterinarios</h1>
    {error && <p className={styles.error}>{error}</p>}
    {veterinarios.length === 0 ? (
      <p className={styles.noResults}>No hay veterinarios disponibles.</p>
    ) : (
      <ul className={styles.veterinariosList}>
  {veterinarios.map((veterinario) => (
    <li key={veterinario.id} className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{veterinario.nombre}</h2>
      </div>
      <div className={styles.cardBody}>
        <p><strong>📍 Dirección:</strong> {veterinario.direccion}</p>
        <p><strong>📞 Teléfono:</strong> {veterinario.nroTelefono}</p>
        <p><strong>🐾 Especies:</strong> {veterinario.especies.map(e => e.nombre).join(', ')}</p>
      </div>
      <div className={styles.cardFooter}>
        <button
          className={styles.primaryButton}
          onClick={() => handleScheduleClick(veterinario.id)}
        >
          Agendar Turno
        </button>
      </div>
    </li>
  ))}
</ul>
    )}
  </div>
);
};


export default VeterinariosList;
