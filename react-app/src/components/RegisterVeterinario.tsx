import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

interface Especie {
  id: number;
  nombre: string;
}

interface Horario {
  dia: string;
  inicio: string;
  fin: string;
}

const RegisterVeterinario: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [matricula, setMatricula] = useState<number | null>(null);
  const [nroTelefono, setNroTelefono] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([
    { dia: '', inicio: '', fin: '' },
  ]);
  const [especiesSeleccionadas, setEspeciesSeleccionadas] = useState<number[]>(
    []
  );
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/especie');
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setEspecies(data.data);
        } else {
          console.error(
            'La respuesta no contiene un arreglo en data.data:',
            data
          );
        }
      } catch (error) {
        console.error('Error al cargar especies:', error);
      }
    };

    fetchEspecies();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/veterinario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          apellido,
          direccion,
          matricula,
          nroTelefono,
          horarios,
          especies: especiesSeleccionadas,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Error al registrarse');
        return;
      }

      setSuccess(true);
      navigate('/login');
    } catch (err) {
      setError('Error al registrarse');
    }
  };

  return (
    <>
      <Menu />
      <div style={styles.container}>
        <h2 style={styles.title}>Registro de Veterinario</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && (
          <p style={styles.success}>
            ¡Registro exitoso! Redirigiendo al login...
          </p>
        )}
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Dirección</label>
            <input
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Matrícula</label>
            <input
              type="number"
              value={matricula || ''}
              onChange={(e) => setMatricula(Number(e.target.value))}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Número de Teléfono</label>
            <input
              type="text"
              value={nroTelefono}
              onChange={(e) => setNroTelefono(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Especies</label>
            <select
              multiple
              value={especiesSeleccionadas.map((id) => id.toString())}
              onChange={(e) =>
                setEspeciesSeleccionadas(
                  Array.from(e.target.selectedOptions, (option) =>
                    Number(option.value)
                  )
                )
              }
              style={styles.select}
            >
              {especies.map((especie: Especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.nombre}
                </option>
              ))}
            </select>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Horarios</label>
            {horarios.map((horario, index) => (
              <div key={index} style={styles.horarioGroup}>
                <select
                  value={horario.dia}
                  onChange={(e) => {
                    const newHorarios = [...horarios];
                    newHorarios[index].dia = e.target.value;
                    setHorarios(newHorarios);
                  }}
                  style={styles.select}
                >
                  <option value="">Selecciona un día</option>
                  {[
                    'Lunes',
                    'Martes',
                    'Miércoles',
                    'Jueves',
                    'Viernes',
                    'Sábado',
                    'Domingo',
                  ].map((dia) => (
                    <option key={dia} value={dia}>
                      {dia}
                    </option>
                  ))}
                </select>
                <input
                  type="time"
                  value={horario.inicio}
                  onChange={(e) => {
                    const newHorarios = [...horarios];
                    newHorarios[index].inicio = e.target.value;
                    setHorarios(newHorarios);
                  }}
                  style={styles.timeInput}
                />
                <input
                  type="time"
                  value={horario.fin}
                  onChange={(e) => {
                    const newHorarios = [...horarios];
                    newHorarios[index].fin = e.target.value;
                    setHorarios(newHorarios);
                  }}
                  style={styles.timeInput}
                />
                <button
                  type="button"
                  onClick={() =>
                    setHorarios(horarios.filter((_, i) => i !== index))
                  }
                  style={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setHorarios([...horarios, { dia: '', inicio: '', fin: '' }])
              }
              style={styles.button}
            >
              Agregar Horario
            </button>
          </div>
          <button type="submit" style={styles.button}>
            Registrar Veterinario
          </button>
        </form>
      </div>
    </>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '160vh',
    padding: '20px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  error: {
    color: 'red',
  },
  success: {
    color: 'green',
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
    color: '#333',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  select: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  timeInput: {
    padding: '10px',
    marginRight: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  horarioGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  deleteButton: {
    padding: '5px',
    backgroundColor: 'red',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '5px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    border: 'none',
  },
};

export default RegisterVeterinario;
