import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '80px',
    color: 'white',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'white',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    fontSize: '14px',
    boxSizing: 'border-box', // Asegura que el padding no afecte el ancho total
    position: 'relative', // Necesario para ajustar el calendario si es necesario
    zIndex: 1, // Asegura que el input esté en el frente
  },
  select: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    fontSize: '14px',
  },
  button: {
    padding: '10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'background-color 0.3s',
    color: 'white',
    backgroundColor: '#007bff',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  success: {
    color: 'green',
    marginBottom: '10px',
  },
};

const AddMascota: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [especieId, setEspecieId] = useState<number | null>(null);
  const [especies, setEspecies] = useState<{ id: number; nombre: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/especie');
        setEspecies(response.data.data);
      } catch (err) {
        setError('Error al cargar las especies de mascotas');
      }
    };

    fetchEspecies();
  }, []);

  const handleAddMascota = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de la fecha de nacimiento
    if (new Date(fechaNacimiento) >= new Date()) {
      setError('La fecha de nacimiento debe ser anterior a la fecha actual');
      return;
    }

    // Validación de especie
    if (!especieId) {
      setError('Debe seleccionar una especie');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const usuarioId = localStorage.getItem('usuarioId');

      if (!token || !usuarioId) {
        setError('No se encontró un usuario autenticado.');
        return;
      }

      await axios.post(
        'http://localhost:3000/api/mascota',
        { nombre, fechaNacimiento, usuarioId, especieId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Mascota agregada');
      navigate('/Mascotas');
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <>
      <Menu />
      <div style={styles.container}>
        <h2 style={{ marginBottom: '20px' }}>Agregar Mascota</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form style={styles.form} onSubmit={handleAddMascota}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre:</label>
            <input
              type="text"
              style={styles.input}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Fecha de Nacimiento:</label>
            <input
              type="date"
              style={styles.input}
              value={fechaNacimiento}
              onChange={(e) => setFechaNacimiento(e.target.value)}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Especie:</label>
            <select
              style={styles.select}
              value={especieId ?? ''}
              onChange={(e) => setEspecieId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Selecciona una Especie
              </option>
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            style={styles.button}
          >
            Agregar Mascota
          </button>
        </form>
      </div>
    </>
  );
};

export default AddMascota;