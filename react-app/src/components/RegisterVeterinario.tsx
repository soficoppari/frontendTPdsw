import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
        if (Array.isArray(data)) {
          setEspecies(data);
        } else {
          console.error('La respuesta no es un arreglo:', data);
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
    <div>
      <h2>Registro de Veterinario</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && (
        <p style={{ color: 'green' }}>
          ¡Registro exitoso! Redirigiendo al login...
        </p>
      )}
      <form onSubmit={handleRegister}>
        <div>
          <label>Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div>
          <label>Dirección</label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />
        </div>
        <div>
          <label>Matrícula</label>
          <input
            type="number"
            value={matricula || ''}
            onChange={(e) => setMatricula(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Número de Teléfono</label>
          <input
            type="text"
            value={nroTelefono}
            onChange={(e) => setNroTelefono(e.target.value)}
          />
        </div>
        <div>
          <label>Especies</label>
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
          >
            {especies.map((especie: Especie) => (
              <option key={especie.id} value={especie.id}>
                {especie.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Horarios</label>
          {horarios.map((horario, index) => (
            <div key={index}>
              <select
                value={horario.dia}
                onChange={(e) => {
                  const newHorarios = [...horarios];
                  newHorarios[index].dia = e.target.value;
                  setHorarios(newHorarios);
                }}
              >
                <option value="">Selecciona un día</option>
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </select>
              <input
                type="time"
                value={horario.inicio}
                onChange={(e) => {
                  const newHorarios = [...horarios];
                  newHorarios[index].inicio = e.target.value;
                  setHorarios(newHorarios);
                }}
              />
              <input
                type="time"
                value={horario.fin}
                onChange={(e) => {
                  const newHorarios = [...horarios];
                  newHorarios[index].fin = e.target.value;
                  setHorarios(newHorarios);
                }}
              />
              <button
                type="button"
                onClick={() =>
                  setHorarios(horarios.filter((_, i) => i !== index))
                }
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
          >
            Agregar Horario
          </button>
        </div>
        <button type="submit">Registrar Veterinario</button>
      </form>
    </div>
  );
};

export default RegisterVeterinario;
