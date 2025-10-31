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
  apellido: string;
  direccion: string;
  nroTelefono: number;
  horarios: Horario[];
  turnos: Turno[];
  especies: Especie[];
  promedio?: number;
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

        let data = response.data?.data;
        if (Array.isArray(data)) {
          data = data.sort(
            (a, b) => (b.promedio ?? 0) - (a.promedio ?? 0)
          );
          setVeterinarios(data);
        } else {
          setVeterinarios([]);
        }
      } catch (err) {
        setError('Error al obtener los veterinarios');
      }
    };

    fetchVeterinarios();
  }, []);

  const handleCardClick = (id: number) => {
    localStorage.setItem('veterinarioId', id.toString());
    navigate(`/AgendarTurno/${id}`);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profesionales</h1>
      <h2
        style={{
          color: '#7fdcff',
          fontWeight: 500,
          marginTop: '-0.5rem',
          marginBottom: '1.5rem',
          fontSize: '1.1rem',
          textAlign: 'center'
        }}
      >
        Haz click para elegir un veterinario
      </h2>
      {error && <p className={styles.error}>{error}</p>}
      {veterinarios.length === 0 ? (
        <p className={styles.noResults}>No hay veterinarios disponibles.</p>
      ) : (
        <ul className={styles.veterinariosList}>
          {veterinarios.map((veterinario) => (
            <li
              key={veterinario.id}
              className={styles.card}
              tabIndex={0}
              role="button"
              onClick={() => handleCardClick(veterinario.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleCardClick(veterinario.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  {veterinario.nombre} {veterinario.apellido}
                </h2>
                <span className={styles.rating}>
                  ⭐ {typeof veterinario.promedio === 'number'
                    ? veterinario.promedio.toFixed(1)
                    : 'Sin calificación'}
                </span>
              </div>
              <div className={styles.cardBody}>
                <p><strong>📍 Dirección:</strong> {veterinario.direccion}</p>
                <p><strong>📞 Teléfono:</strong> {veterinario.nroTelefono}</p>
                <p><strong>🐾 Especies:</strong> {veterinario.especies.map(e => e.nombre).join(', ')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VeterinariosList;
