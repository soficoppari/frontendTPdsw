import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './AgendarTurno.module.css';

type HorarioDisponible = {
  id: number;
  inicio: string;   // "08:00"
  fin: string;      // "12:00"
  diaSemana: number; // 0 = domingo ... 6 = sábado
};


const AddTurno: React.FC = () => {
  const [horariosDelDia, setHorariosDelDia] = useState<HorarioDisponible[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('');
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<HorarioDisponible | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

useEffect(() => {
  const fetchHorarios = async () => {
    try {
      const veterinarioId = localStorage.getItem('veterinarioId');
      if (!veterinarioId) {
        setError('No se encontró un veterinario seleccionado.');
        return;
      }

      const response = await axios.get(`http://localhost:3000/api/veterinario/${veterinarioId}`);
      const horariosBackend = response.data.data.horariosDisponibles; // <-- aquí según tu backend
      console.log('Horarios cargados del backend:', horariosBackend); // log aquí

    } catch (err) {
      setError('Error al cargar los horarios del veterinario.');
    }
  };

  fetchHorarios();
}, []);

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const fecha = e.target.value;
  setFechaSeleccionada(fecha);
  setHorarioSeleccionado(null);

  if (!fecha) return;

  const veterinarioId = localStorage.getItem('veterinarioId');
  if (!veterinarioId) {
    setError('No se encontró un veterinario seleccionado.');
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/api/veterinario/${veterinarioId}/horarios-disponibles?fecha=${fecha}`
    );
    console.log('Respuesta cruda del backend:', response.data.horariosDisponibles);
    const disponibles = response.data.horariosDisponibles.map((h: HorarioDisponible) => ({
      id: h.id,
      inicio: h.inicio,
      fin: h.fin,
      diaSemana: h.diaSemana,
    }));
    console.log('Horarios mapeados para el frontend:', disponibles);
    setHorariosDelDia(disponibles);

    if (disponibles.length === 0) setError('No hay horarios disponibles para esta fecha.');
    else setError('');
  } catch {
    setError('Error al consultar horarios disponibles.');
    setHorariosDelDia([]);
  }
};

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    const seleccionado = horariosDelDia.find(h => h.id === id) || null;
    setHorarioSeleccionado(seleccionado);
  };

  const handleAddTurno = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaSeleccionada || !horarioSeleccionado) {
      setError('Seleccione una fecha y un horario.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const mascotaId = localStorage.getItem('mascotaId');
      const veterinarioId = localStorage.getItem('veterinarioId');

      if (!token || !mascotaId || !veterinarioId) {
        setError('Faltan datos requeridos para agendar el turno.');
        return;
      }

      await axios.post(
        'http://localhost:3000/api/turno',
        { mascotaId, veterinarioId, fecha: fechaSeleccionada, horarioId: horarioSeleccionado.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Turno registrado con éxito');
      setError('');
      navigate('/Turnos');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) setError(err.response?.data?.message || 'Error del servidor');
      else if (err instanceof Error) setError(err.message);
      else setError('Error desconocido');
      setSuccess('');
    }
  };

  // Calcula la fecha de mañana en formato YYYY-MM-DD
  const getTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Turno</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form className={styles.form} onSubmit={handleAddTurno}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Seleccione una fecha:</label>
          <input
            type="date"
            className={styles.input}
            value={fechaSeleccionada}
            onChange={handleDateChange}
            required
            min={getTomorrow()} // <-- Solo permite fechas posteriores a hoy
          />
        </div>

        {horariosDelDia.length > 0 && (
          <div className={styles.formGroup}>
            <label className={styles.label}>Seleccione un horario:</label>
            <select
              className={styles.select}
              value={horarioSeleccionado?.id || ''}
              onChange={handleHorarioChange}
              required
            >
              <option value="" disabled>Seleccione un horario</option>
              {horariosDelDia.map(h => (
                <option key={h.id} value={h.id}>
                  {h.inicio && h.fin ? `${h.inicio} - ${h.fin}` : '-'}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className={styles.submitButton}>Registrar Turno</button>
      </form>
    </div>
  );
};

export default AddTurno;
