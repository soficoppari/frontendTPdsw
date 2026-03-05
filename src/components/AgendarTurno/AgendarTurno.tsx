import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { es } from 'date-fns/locale';
import styles from './AgendarTurno.module.css';

registerLocale('es', es);

type HorarioDisponible = {
  id: number;
  inicio: string;   // "08:00"
  fin: string;      // "12:00"
  diaSemana: number; // 0 = domingo ... 6 = sábado
};


const AddTurno: React.FC = () => {
  const [horariosDelDia, setHorariosDelDia] = useState<HorarioDisponible[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [workingDays, setWorkingDays] = useState<number[]>([]);
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
        const horariosBackend = response.data.data.horariosDisponibles;

        // Extraemos los días de la semana en los que el veterinario tiene horarios cargados
        const diasQueAtiende = Array.from(new Set(horariosBackend.map((h: any) => h.diaSemana))) as number[];
        setWorkingDays(diasQueAtiende);

        console.log('Días que atiende el veterinario (0=Dom, 1=Lun...):', diasQueAtiende);

      } catch (err) {
        setError('Error al cargar la información del veterinario.');
      }
    };

    fetchHorarios();
  }, []);

  const handleDateChange = async (date: Date | null) => {
    setFechaSeleccionada(date);
    setHorarioSeleccionado(null);
    setHorariosDelDia([]);

    if (!date) return;

    const veterinarioId = localStorage.getItem('veterinarioId');
    if (!veterinarioId) {
      setError('No se encontró un veterinario seleccionado.');
      return;
    }

    try {
      // Ajustamos la fecha para que no tenga problemas de zona horaria al enviarla al backend
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      const fechaFormateada = `${yyyy}-${mm}-${dd}`;

      const response = await axios.get(
        `http://localhost:3000/api/veterinario/${veterinarioId}/horarios-disponibles?fecha=${fechaFormateada}`
      );

      const disponibles = response.data.horariosDisponibles.map((h: HorarioDisponible) => ({
        id: h.id,
        inicio: h.inicio,
        fin: h.fin,
        diaSemana: h.diaSemana,
      }));

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

      const yyyy = fechaSeleccionada.getFullYear();
      const mm = String(fechaSeleccionada.getMonth() + 1).padStart(2, '0');
      const dd = String(fechaSeleccionada.getDate()).padStart(2, '0');
      const fechaFormateada = `${yyyy}-${mm}-${dd}`;

      await axios.post(
        'http://localhost:3000/api/turno',
        { mascotaId, veterinarioId, fecha: fechaFormateada, horarioId: horarioSeleccionado.id },
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


  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Registrar Turno</h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form className={styles.form} onSubmit={handleAddTurno}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Seleccione una fecha:</label>
          <DatePicker
            selected={fechaSeleccionada}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            minDate={new Date(new Date().setDate(new Date().getDate() + 1))} // Mañana
            filterDate={(date) => workingDays.includes(date.getDay())}
            placeholderText="Haga click para elegir fecha"
            className={styles.input}
            locale="es"
            required
            autoComplete="off"
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
