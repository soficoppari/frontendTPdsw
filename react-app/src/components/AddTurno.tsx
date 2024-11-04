import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTurno: React.FC = () => {
  const [horarios, setHorarios] = useState<
    { id: number; dia: string; horaFin: string; horaInicio: string }[]
  >([]);
  const [horariosFiltrados, setHorariosFiltrados] = useState<
    { id: number; horaInicio: string; horaFin: string }[]
  >([]);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState<number | null>(
    null
  );
  const [intervalos, setIntervalos] = useState<string[]>([]);
  const [intervaloSeleccionado, setIntervaloSeleccionado] =
    useState<string>('');
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
      setHorariosFiltrados([]);
      setIntervalos([]); // Limpiar intervalos
      return;
    }

    setError('');

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

    const horariosDelDia = horarios.filter(
      (horario) => horario.dia.toLowerCase() === diaSemanaSeleccionado
    );
    setHorariosFiltrados(horariosDelDia);
  };

  const crearIntervalos = (horaInicio: string, horaFin: string) => {
    const start = new Date(`1970-01-01T${horaInicio}:00`);
    const end = new Date(`1970-01-01T${horaFin}:00`);
    const intervalosGenerados: string[] = [];

    let current = start;

    while (current < end) {
      const next = new Date(current);
      next.setHours(current.getHours() + 1);
      intervalosGenerados.push(
        `${current.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })} - ${next.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}`
      );
      current = next;
    }

    return intervalosGenerados;
  };

  const handleHorarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHorarioId = Number(e.target.value);
    const horarioSeleccionado = horariosFiltrados.find(
      (horario) => horario.id === selectedHorarioId
    );

    if (horarioSeleccionado) {
      const intervalosGenerados = crearIntervalos(
        horarioSeleccionado.horaInicio,
        horarioSeleccionado.horaFin
      );
      setIntervalos(intervalosGenerados);
      setHorarioSeleccionado(selectedHorarioId);
      setIntervaloSeleccionado(''); // Limpiar el intervalo seleccionado al cambiar de horario
    }
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

        {horariosFiltrados.length > 0 && (
          <>
            <label>Seleccione un horario disponible:</label>
            <select onChange={handleHorarioChange} required>
              <option value="" disabled>
                Seleccione un horario
              </option>
              {horariosFiltrados.map((horario) => (
                <option key={horario.id} value={horario.id}>
                  {`${horario.horaInicio} - ${horario.horaFin}`}
                </option>
              ))}
            </select>

            {intervalos.length > 0 && (
              <>
                <label>Seleccione un intervalo:</label>
                <select
                  value={intervaloSeleccionado}
                  onChange={(e) => setIntervaloSeleccionado(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Seleccione un intervalo
                  </option>
                  {intervalos.map((intervalo, index) => (
                    <option key={index} value={intervalo}>
                      {intervalo}
                    </option>
                  ))}
                </select>
              </>
            )}
          </>
        )}
        <button type="submit">Registrar Turno</button>
      </form>
    </div>
  );
};

export default AddTurno;
