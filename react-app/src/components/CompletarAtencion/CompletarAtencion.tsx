import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CompletarAtencion: React.FC = () => {
  const { turnoId } = useParams();
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem('token');

    await axios.patch(
      `http://localhost:3000/api/turno/${turnoId}/completar`,
      { observaciones },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess('Turno completado exitosamente.');
    setTimeout(() => navigate('/turnosveterinario'), 2000);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'Error del servidor');
    } else {
      setError('Ocurrió un error inesperado.');
    }
  }
};


  return (
    <div className="completar-container">
      <h2>Completar Atención</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Observaciones:</label>
        <textarea
          rows={5}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ejemplo: Paracetamol cada 8 horas"
          required
        />
        <button type="submit">Finalizar Turno</button>
      </form>
    </div>
  );
};

export default CompletarAtencion;
