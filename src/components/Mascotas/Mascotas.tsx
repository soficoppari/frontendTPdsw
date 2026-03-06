import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Mascotas.module.css';

// Puedes usar emojis o importar íconos según la especie
const especieIcono = (especie: string) => {
  switch (especie.toLowerCase()) {
    case 'perro':
      return '🐶';
    case 'gato':
      return '🐱';
    case 'ave':
      return '🐦';
    case 'conejo':
      return '🐰';
    default:
      return '🐾';
  }
};

type Usuario = {
  id: number;
  nombre: string;
};

type Raza = {
  id: number;
  nombre: string;
  especie: {
    id: number;
    nombre: string;
  };
};

type Mascota = {
  id: number;
  nombre: string;
  fechaNacimiento: string;
  usuario: Usuario;
  raza: Raza;
};

const Mascotas: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('https://backendtpdsw-production-c234.up.railway.app/api/mascota', {
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

  const handleAgendarTurno = (mascotaId: number, especieId: number) => {
    localStorage.setItem('mascotaId', mascotaId.toString());
    localStorage.setItem('especieMascota', especieId.toString());
    navigate('/Veterinarios');
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tus Mascotas</h2>
      <h3
        style={{
          color: '#7fdcff',
          fontWeight: 500,
          marginTop: '-0.5rem',
          marginBottom: '1.5rem',
          fontSize: '1.1rem',
          textAlign: 'center'
        }}
      >
        Haz click para agendar un turno para tu Mascota
      </h3>
      {error && <p className={styles.error}>{error}</p>}
      {mascotas.length === 0 ? (
        <p>No has ingresado ninguna mascota aún.</p>
      ) : (
        <ul className={styles.mascotasList}>
          {mascotas.map((mascota) => (
            <li
              key={mascota.id}
              className={styles.card}
              tabIndex={0}
              role="button"
              onClick={() =>
                handleAgendarTurno(mascota.id, mascota.raza.especie.id)
              }
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') handleAgendarTurno(mascota.id, mascota.raza.especie.id);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className={styles.cardHeader}>
                <span className={styles.especieIcon}>
                  {especieIcono(mascota.raza.especie.nombre)}
                </span>
                <h3 className={styles.cardTitle}>{mascota.nombre}</h3>
              </div>
              <div className={styles.cardBody}>
                <p>
                  <span style={{ color: "#ff5e5e" }}>🧬</span> <strong>Raza:</strong> {mascota.raza.nombre}
                </p>
                <p>
                  <span style={{ color: "#ffd700" }}>🎂</span> <strong></strong> {mascota.fechaNacimiento}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
      <button className={styles.addButton} onClick={handleAddMascota}>
        Agregar nueva mascota
      </button>
    </div>
  );
};

export default Mascotas;
