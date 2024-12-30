import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu';

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
    <>
      <Menu />
      <div style={styles.container}>
        <h1 style={styles.title}>Lista de Veterinarios</h1>
        {error && <p style={styles.error}>{error}</p>}
        {veterinarios.length === 0 ? (
          <p>No hay veterinarios disponibles.</p>
        ) : (
          <ul style={styles.veterinariosList}>
            {veterinarios.map((veterinario) => (
              <li key={veterinario.id} style={styles.card}>
                <h2>{veterinario.nombre}</h2>
                <p>
                  <strong>Dirección:</strong> {veterinario.direccion}
                </p>
                <p>
                  <strong>Número de Teléfono:</strong> {veterinario.nroTelefono}
                </p>
                <p>
                  <strong>Especies de servicio:</strong>{' '}
                  {veterinario.especies
                    .map((especie) => especie.nombre)
                    .join(', ')}
                </p>
                <div style={styles.buttons}>
                  <button
                    style={styles.primaryButton}
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
    </>
  );
};

// Define styles using React.CSSProperties
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  error: {
    color: 'red',
  },
  veterinariosList: {
    listStyle: 'none',
    padding: 0,
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '20px',
    margin: '15px 0',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
  },
  buttons: {
    textAlign: 'right',
  },
  primaryButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default VeterinariosList;
