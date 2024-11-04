import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTurno: React.FC = () => {
  const [horarios, setHorarios] = useState<
    { id: number; dia: string; horaFin: string; horaInicio: string }[]
  >([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);
  const [horariosFiltrados, setHorariosFiltrados] = useState<
    { id: number; horaInicio: string; horaFin: string }[]
  >([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<number | null>(
    null
  );
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
      setHorariosFiltrados([]);
      return;
    }

    setError('');

    // Extrae el día de la semana (por ejemplo, "lunes", "martes")
    const diasSemana = [
      'domingo',
      'lunes',
      'martes',
      'miércoles',
      'jueves',
      'viernes',
      'sábado',
    ];
    const diaSemanaSeleccionado = diasSemana[selectedDate.getDay()];

    setDiaSeleccionado(diaSemanaSeleccionado);

    // Filtra los horarios según el día de la semana seleccionado
    const horariosDelDia = horarios.filter(
      (horario) => horario.dia.toLowerCase() === diaSemanaSeleccionado
    );
    setHorariosFiltrados(horariosDelDia);
  };

  const handleAddTurno = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const mascotaId = localStorage.getItem('mascotaId');
      const veterinarioId = localStorage.getItem('veterinarioId');

      if (!token || !mascotaId || !veterinarioId || !horarioSeleccionado) {
        setError(
          'Información incompleta. Verifique que se haya seleccionado una mascota, un veterinario y un horario.'
        );
        return;
      }

      await axios.post(
        'http://localhost:3000/api/turno',
        { mascotaId, veterinarioId, horarioId: horarioSeleccionado },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Turno registrado con éxito');
      navigate('/MisTurnos');
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  const formatHora = (timeString: string) => {
    const date = new Date(`1970-01-01T${timeString}:00`);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
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
          min={new Date().toISOString().split('T')[0]} // Restringe fechas pasadas
        />

        {diaSeleccionado && (
          <>
            <label>Seleccione un horario disponible:</label>
            <select
              value={horarioSeleccionado || ''}
              onChange={(e) => setHorarioSeleccionado(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Seleccione un horario
              </option>
              {horariosFiltrados.map((horario) => (
                <option key={horario.id} value={horario.id}>
                  {`${formatHora(horario.horaInicio)} - ${formatHora(
                    horario.horaFin
                  )}`}
                </option>
              ))}
            </select>
          </>
        )}
        <button type="submit">Registrar Turno</button>
      </form>
    </div>
  );
};

export default AddTurno;
