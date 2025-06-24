import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterVeterinario.module.css';
import Menu from '../Menu/Menu';

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
  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [horarios, setHorarios] = useState<Horario[]>([
    { dia: '', inicio: '08:00', fin: '17:00' },
  ]);
  const [especiesSeleccionadas, setEspeciesSeleccionadas] = useState<Especie[]>(
    []
  );
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [step, setStep] = useState(1); // Estado para controlar el paso actual

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

  const handleNextStep = () => {
    if (step === 1) {
      if (
        !nombre ||
        !apellido ||
        !direccion ||
        !nroTelefono ||
        !email ||
        !contrasenia
      ) {
        setError('Por favor, completa todos los campos del paso 1.');
        return;
      }
    }
    setError('');
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
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
      <div className="registerContainer">
        <h2 className="title">Registro de Veterinario</h2>
        {error && <p className="error">{error}</p>}
        {success && (
          <p className="success">¡Registro exitoso! Redirigiendo al login...</p>
        )}

        {step === 1 && (
          <form className="registerForm">
          <div className="formColumn">
            <div className="formGroup">
              <label className="label">Matrícula</label>
              <input
                type="number"
                value={matricula || ''}
                onChange={(e) => setMatricula(Number(e.target.value))}
                className="input"
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="input"
                required
              />
            </div>
          </div>
        
          <div className="formColumn">
            <div className="formGroup">
              <label className="label">Número de Teléfono</label>
              <input
                type="text"
                value={nroTelefono}
                onChange={(e) => setNroTelefono(e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                required
              />
            </div>
            <div className="formGroup">
              <label className="label">Contraseña</label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                className="input"
                required
              />
            </div>
            <button type="button" onClick={handleNextStep} className="registerButton">
              Siguiente
            </button>
          </div>
        </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister} className="form">
            <div className="formGroup">
              <label className="label">Especies</label>
              <div className="selectContainer" onClick={toggleDropdown}>
                <div className="dropdownArrow">▼</div>
              </div>
              {dropdownVisible && (
                <div className="dropdown">
                  {especies.map((especie) => (
                    <div
                      key={especie.id}
                      className="dropdownItem"
                      onClick={() => handleSelectEspecie(especie)}
                    >
                      {especie.nombre}
                    </div>
                  ))}
                </div>
              )}
              <div className="selectedItems">
                {especiesSeleccionadas.map((especie) => (
                  <div key={especie.id} className="selectedItem">
                    {especie.nombre}
                    <button
                      type="button"
                      onClick={() => handleDeselectEspecie(especie.id)}
                      className="removeButton"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="formGroup">
              <label className="label">Horarios</label>
              {horarios.map((horario, index) => (
                <div key={index} className="horarioGroup">
                  <select
                    value={horario.dia}
                    onChange={(e) =>
                      handleHorarioChange(index, 'dia', e.target.value)
                    }
                    className="select"
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
                  <label>
                    Hora de Inicio
                    <input
                      type="time"
                      value={horario.inicio}
                      onChange={(e) =>
                        handleHorarioChange(index, 'inicio', e.target.value)
                      }
                      className="timeInput"
                    />
                  </label>
                  <label>
                    Hora Fin
                    <input
                      type="time"
                      value={horario.fin}
                      onChange={(e) =>
                        handleHorarioChange(index, 'fin', e.target.value)
                      }
                      className="timeInput"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveHorario(index)}
                    className="deleteButton"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddHorario}
                className="button"
              >
                Agregar Horario
              </button>
            </div>
            <div className="buttonGroup">
              <button
                type="button"
                onClick={handlePreviousStep}
                className="button"
              >
                Anterior
              </button>
              <button type="submit" className="button">
                Registrar Veterinario
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default RegisterVeterinario;
