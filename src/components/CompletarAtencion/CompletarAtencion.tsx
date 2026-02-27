import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './CompletarAtencion.module.css';

const especieIcono = (especie: string) => {
  switch ((especie || '').toLowerCase()) {
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

const CompletarAtencion: React.FC = () => {
  const { turnoId } = useParams<{ turnoId: string }>();
  const [observaciones, setObservaciones] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [turnoInfo, setTurnoInfo] = useState<{
    usuarioNombre: string;
    usuarioApellido: string;
    mascotaNombre: string;
    especieNombre: string;
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTurnoInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(
          `https://backendtpdswproduction7bb3.up.railway.app/api/turno/${turnoId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const turno = data.data;

        setTurnoInfo({
          // ahora vienen desde mascota.usuario (incluido en el backend arriba)
          usuarioNombre: turno?.mascota?.usuario?.nombre ?? '',
          usuarioApellido: turno?.mascota?.usuario?.apellido ?? '',
          mascotaNombre: turno?.mascota?.nombre ?? '',
          // 👇 especie viene como string plano
          especieNombre: turno?.mascota?.especie ?? '',
        });
      } catch {
        setTurnoInfo(null);
        setError('No se pudo cargar la información del turno.');
      }
    };

    if (turnoId) fetchTurnoInfo();
  }, [turnoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `https://backendtpdswproduction7bb3.up.railway.app/api/turno/${turnoId}/completar`,
        { observaciones },
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className={styles["completar-container"]}>
      <h2>
        {turnoInfo
          ? <>
              Turno de <span style={{ color: "#7fdcff" }}>{turnoInfo.usuarioNombre} {turnoInfo.usuarioApellido}</span>
              <br />
              <span style={{ fontWeight: 400, fontSize: "1.1rem" }}>
                para: <span style={{ color: "#fff" }}>{turnoInfo.mascotaNombre}</span> {especieIcono(turnoInfo.especieNombre)}
              </span>
            </>
          : "Cargando turno..."}
      </h2>
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <label>Observaciones:</label>
        <textarea
          rows={5}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Ejemplo: Paracetamol cada 8 horas"
          required
        />
        <button type="submit">Completar Atencion</button>
      </form>
    </div>
  );
};

export default CompletarAtencion;
