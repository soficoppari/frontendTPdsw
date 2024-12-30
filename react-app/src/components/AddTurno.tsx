import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu/Menu';

const AddTurno: React.FC = () => {
  const [horarios, setHorarios] = useState<
    { id: number; dia: string; horaFin: string; horaInicio: string }[]
  >([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [horariosDisponibles, setHorariosDisponibles] = useState<string[]>([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<string | null>(
    null
  );
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(
    null
  );
  const [fechaHora, setFechaHora] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVeterinario = async () => {
      try {
        const veterinarioId = localStorage.getItem('veterinarioId');
        if (!veterinarioId) {
          setError('No se encontró un veterinario seleccionado.');
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/api/veterinario/${veterinarioId}`
        );
        setHorarios(response.data.data.horarios || []);
      } catch (err) {
        setError('Error al cargar los horarios del veterinario.');
      }
    };

    fetchVeterinario();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const today = new Date();

    if (selectedDate <= today) {
      setError('Seleccione una fecha posterior al día de hoy.');
      setDiaSeleccionado(null);
      setHorariosDisponibles([]);
      setFechaSeleccionada(null);
      return;
    }

    setError('');
    setFechaSeleccionada(e.target.value);

    const diasSemana = [
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
      'domingo',
    ];
    const diaSemanaSeleccionado = diasSemana[selectedDate.getDay()];

    setDiaSeleccionado(diaSemanaSeleccionado);

    const horariosDelDia = horarios.filter(
      (horario) => horario.dia.toLowerCase() === diaSemanaSeleccionado
    );

    const nuevosHorariosDisponibles = horariosDelDia.flatMap((horario) =>
      generarHorariosPorHora(horario.horaInicio, horario.horaFin)
    );
    setHorariosDisponibles(nuevosHorariosDisponibles);
  };

  const generarHorariosPorHora = (horaInicio: string, horaFin: string) => {
    const start = new Date(`1970-01-01T${horaInicio}:00`);
    const end = new Date(`1970-01-01T${horaFin}:00`);
    const slots = [];

    while (start < end) {
      const endSlot = new Date(start.getTime() + 60 * 60 * 1000);
      slots.push(
        `${start.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${endSlot.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      );
      start.setHours(start.getHours() + 1);
    }

    return slots;
  };
  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHorario = e.target.value;
    setHorarioSeleccionado(selectedHorario);

    if (fechaSeleccionada && selectedHorario) {
      // Extraer solo la hora de inicio en formato de 24 horas
      const horaInicio = selectedHorario.split(' - ')[0];
      const horaNormalizada = new Date(
        `${fechaSeleccionada}T${horaInicio}`
      ).toISOString(); // Genera una fecha en formato ISO
      setFechaHora(horaNormalizada);
    }
  };
  const handleAddTurno = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const mascotaId = localStorage.getItem('mascotaId');
      const veterinarioId = localStorage.getItem('veterinarioId');
      const usuarioId = localStorage.getItem('usuarioId');

      if (!token || !mascotaId || !veterinarioId || !fechaHora || !usuarioId) {
        setError(
          'Información incompleta. Verifique que se haya seleccionado una mascota, un veterinario y un horario.'
        );
        return;
      }
      console.log('Token:', token);

      await axios.post(
        'http://localhost:3000/api/turno',
        { mascotaId, veterinarioId, fechaHora, usuarioId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Turno registrado con éxito');
      navigate('/Turnos');
    } catch (err) {
      console.error(err); // Esto te dará más información sobre el problema
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <>
      <Menu />
      <div>
        <h2>Registrar Turno</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleAddTurno}>
          <label>Seleccione una fecha:</label>
          <input
            type="date"
            onChange={handleDateChange}
            required
            min={new Date().toISOString().split('T')[0]}
          />

          {diaSeleccionado && (
            <>
              <label>Seleccione un horario disponible:</label>
              <select
                value={horarioSeleccionado || ''}
                onChange={handleHorarioChange}
                required
              >
                <option value="" disabled>
                  Seleccione un horario
                </option>
                {horariosDisponibles.map((horario, index) => (
                  <option key={index} value={horario}>
                    {horario}
                  </option>
                ))}
              </select>
            </>
          )}
          <button type="submit">Registrar Turno</button>
        </form>
      </div>
    </>
  );
};

export default AddTurno;
