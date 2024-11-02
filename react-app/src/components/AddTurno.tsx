import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddTurno: React.FC = () => {
  const [horarios, setHorarios] = useState<
    { id: number; dia: string; horaFin: Date; horaInicio: Date }[]
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
        setHorarios(response.data.data.horarios || []); // Asegúrate de que sea un array vacío si no hay horarios
      } catch (err) {
        setError('Error al cargar los horarios del veterinario.');
      }
    };

    fetchVeterinario();
  }, []);

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

      // Registrar el turno en el backend
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

  // Función para formatear la hora
  const formatHora = (date: Date) => new Date(date).toLocaleTimeString();

  return (
    <div>
      <h2>Registrar Turno</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleAddTurno}>
        <label>Seleccione un horario disponible:</label>
        <select
          value={horarioSeleccionado || ''}
          onChange={(e) => setHorarioSeleccionado(Number(e.target.value))}
          required
        >
          <option value="" disabled>
            Seleccione un horario
          </option>
          {horarios.map((horario) => (
            <option key={horario.id} value={horario.id}>
              {`${formatHora(horario.horaInicio)} - ${formatHora(
                horario.horaFin
              )}`}
            </option>
          ))}
        </select>
        <button type="submit">Registrar Turno</button>
      </form>
    </div>
  );
};

export default AddTurno;
