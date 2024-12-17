import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

interface Especie {
  id: number;
  nombre: string;
}

interface Horario {
  dia: string;
  inicio: string; // Cambiado a string para manejar el formato de tiempo
  fin: string; // Cambiado a string para manejar el formato de tiempo
}
//type
const RegisterVeterinario: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [matricula, setMatricula] = useState<number | null>(null);
  const [nroTelefono, setNroTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([
    { dia: '', inicio: '08:00', fin: '17:00' }, // Horarios iniciales
  ]);
  const [especiesSeleccionadas, setEspeciesSeleccionadas] = useState<Especie[]>(
    []
  );
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleSelectEspecie = (especie: Especie) => {
    if (!especiesSeleccionadas.some((e) => e.id === especie.id)) {
      setEspeciesSeleccionadas([...especiesSeleccionadas, especie]);
    }
  };

  const handleDeselectEspecie = (id: number) => {
    setEspeciesSeleccionadas(especiesSeleccionadas.filter((e) => e.id !== id));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const formattedHorarios = horarios.map((horario) => ({
      dia: horario.dia,
      horaInicio: horario.inicio,
      horaFin: horario.fin,
    }));

    try {
      const response = await fetch('http://localhost:3000/api/veterinario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matricula,
          nombre,
          apellido,
          direccion,
          nroTelefono,
          email,
          contrasenia,
          horarios: formattedHorarios,
          especies: especiesSeleccionadas.map((e) => e.id),
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

  const handleAddHorario = () => {
    setHorarios([...horarios, { dia: '', inicio: '08:00', fin: '17:00' }]);
  };

  const handleHorarioChange = (
    index: number,
    field: 'dia' | 'inicio' | 'fin',
    value: string
  ) => {
    const newHorarios = [...horarios];
    newHorarios[index][field] = value;
    setHorarios(newHorarios);
  };

  const handleRemoveHorario = (index: number) => {
    setHorarios(horarios.filter((_, i) => i !== index));
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
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Especies</label>
            <div style={styles.selectContainer} onClick={toggleDropdown}>
              <div style={styles.dropdownArrow}>▼</div>
            </div>
            {dropdownVisible && (
              <div style={styles.dropdown}>
                {especies.map((especie) => (
                  <div
                    key={especie.id}
                    style={styles.dropdownItem}
                    onClick={() => handleSelectEspecie(especie)}
                  >
                    {especie.nombre}
                  </div>
                ))}
              </div>
            )}
            <div style={styles.selectedItems}>
              {especiesSeleccionadas.map((especie) => (
                <div key={especie.id} style={styles.selectedItem}>
                  {especie.nombre}
                  <button
                    type="button"
                    onClick={() => handleDeselectEspecie(especie.id)}
                    style={styles.removeButton}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Horarios</label>
            {horarios.map((horario, index) => (
              <div key={index} style={styles.horarioGroup}>
                <select
                  value={horario.dia}
                  onChange={(e) =>
                    handleHorarioChange(index, 'dia', e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="">Día</option>
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
                  onChange={(e) =>
                    handleHorarioChange(index, 'inicio', e.target.value)
                  }
                  style={styles.timeInput}
                />
                <input
                  type="time"
                  value={horario.fin}
                  onChange={(e) =>
                    handleHorarioChange(index, 'fin', e.target.value)
                  }
                  style={styles.timeInput}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveHorario(index)}
                  style={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddHorario}
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
    padding: '110px',
  },
  title: {
    marginBottom: '20px',
    color: '#dcedff',
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
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    color: '#dcedff',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
  },
  selectContainer: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    width: '100%',
    cursor: 'pointer',
    color: '#dcedff',
  },
  dropdown: {
    border: '1px solid #ccc',
    borderRadius: '4px',
    position: 'sticky',
    zIndex: 10,
    backgroundColor: 'black',
    width: '100%',
  },
  dropdownItem: {
    padding: '10px',
    cursor: 'pointer',
    color: '#dcedff',
  },
  selectedItems: {
    marginTop: '10px',
    color: '#dcedff',
  },
  selectedItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '5px 10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginBottom: '5px',
    color: '#dcedff',
  },
  removeButton: {
    marginLeft: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'red',
  },
  horarioGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  timeInput: {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    marginLeft: '10px',
  },
  deleteButton: {
    marginLeft: '10px',
    padding: '5px 10px',
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  button: {
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default RegisterVeterinario;
