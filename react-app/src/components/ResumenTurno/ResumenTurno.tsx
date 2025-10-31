import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './ResumenTurno.module.css';

type Mascota = {
  id: number;
  nombre: string;
  especie: string; // Asegúrate de que tu backend envía la especie
};

type Turno = {
  id: number;
  fechaHora: string;
  mascota: Mascota;
  observaciones: string;
};

const especieIcono: Record<string, string> = {
  perro: '🐶',
  gato: '🐱',
  ave: '🐦',
  // Agrega más especies si es necesario
};

const ResumenTurno: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [turno, setTurno] = useState<Turno | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurno = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/api/turno/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTurno(response.data.data);
      } catch {
        setError('No se pudo cargar el resumen del turno');
      }
    };
    fetchTurno();
  }, [id]);

  // Función para formatear la fecha en UTC con formato bonito
  const formatFechaHoraBonitaUTC = (fechaHora: string) => {
    const fecha = new Date(fechaHora);
    const dia = fecha.getUTCDate();
    const mes = fecha.toLocaleString('es-AR', { month: 'long', timeZone: 'UTC' });
    let hora = fecha.getUTCHours();
    const minutos = fecha.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hora < 12 ? 'a. m.' : 'p. m.';
    if (hora === 0) hora = 12;
    else if (hora > 12) hora -= 12;
    return `${dia} de ${mes}, ${hora.toString().padStart(2, '0')}:${minutos} ${ampm}`;
  };

  if (error) return <div>{error}</div>;
  if (!turno) return <div>Cargando...</div>;

  const icono = especieIcono[turno.mascota.especie.toLowerCase()] || '🐾';

  console.log(turno);

  return (
    <div className={styles['resumen-container']}>
      <h2 className={styles['resumen-title']}>
        Turno de: {turno.mascota.nombre} <span>{icono}</span>
      </h2>
      <p className={styles['resumen-info']}>
        <strong>Fecha:</strong>{' '}
        {formatFechaHoraBonitaUTC(turno.fechaHora)}
      </p>
      <p className={styles['resumen-info']}>
        <strong>Observaciones:</strong> {turno.observaciones || 'Sin observaciones'}
      </p>
      <button
        onClick={() => navigate(-1)}
        className={styles['resumen-button']}
      >
        Volver
      </button>
    </div>
  );
};

export default ResumenTurno;