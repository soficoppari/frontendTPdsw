import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterVeterinario.module.css';

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
  const [especiesSeleccionadas, setEspeciesSeleccionadas] = useState<Especie[]>([]);
  const [especies, setEspecies] = useState<Especie[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/especie');
        const data = await response.json();
        if (Array.isArray(data.data)) {
          setEspecies(data.data);
        }
      } catch (error) {
        console.error('Error al cargar especies:', error);
      }
    };
    fetchEspecies();
  }, []);

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

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
    const formattedHorarios = horarios.map((h) => ({
      dia: h.dia,
      horaInicio: h.inicio,
      horaFin: h.fin,
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
    } catch {
      setError('Error al registrarse');
    }
  };

  const handleNextStep = () => {
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
    setError('');
    setStep(step + 1);
  };

  const handlePreviousStep = () => setStep(step - 1);

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
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Registro de Veterinario</h2>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>¡Registro exitoso! Redirigiendo al login...</p>}

      {step === 1 && (
        <form className={styles.registerForm}>
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Matrícula</label>
              <input
                type="number"
                value={matricula || ''}
                onChange={(e) => setMatricula(Number(e.target.value))}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Apellido</label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Número de Teléfono</label>
              <input
                type="text"
                value={nroTelefono}
                onChange={(e) => setNroTelefono(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Contraseña</label>
              <input
                type="password"
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
                className={styles.input}
              />
            </div>
            <button
              type="button"
              onClick={handleNextStep}
              className={styles.registerButton}
            >
              Siguiente
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Especies</label>
            <div className={styles.selectContainer} onClick={toggleDropdown}>
              <div className={styles.dropdownArrow}>▼</div>
            </div>
            {dropdownVisible && (
              <div className={styles.dropdown}>
                {especies.map((especie) => (
                  <div
                    key={especie.id}
                    className={styles.dropdownItem}
                    onClick={() => handleSelectEspecie(especie)}
                  >
                    {especie.nombre}
                  </div>
                ))}
              </div>
            )}
            <div className={styles.selectedItems}>
              {especiesSeleccionadas.map((especie) => (
                <div key={especie.id} className={styles.selectedItem}>
                  {especie.nombre}
                  <button
                    type="button"
                    onClick={() => handleDeselectEspecie(especie.id)}
                    className={styles.removeButton}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Horarios</label>
            {horarios.map((horario, index) => (
              <div key={index} className={styles.horarioGroup}>
                <select
                  value={horario.dia}
                  onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
                  className={styles.select}
                >
                  <option value="">Día</option>
                  {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((dia) => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
                <label>
                  Hora de Inicio
                  <input
                    type="time"
                    value={horario.inicio}
                    onChange={(e) => handleHorarioChange(index, 'inicio', e.target.value)}
                    className={styles.timeInput}
                  />
                </label>
                <label>
                  Hora Fin
                  <input
                    type="time"
                    value={horario.fin}
                    onChange={(e) => handleHorarioChange(index, 'fin', e.target.value)}
                    className={styles.timeInput}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleRemoveHorario(index)}
                  className={styles.deleteButton}
                >
                  Eliminar
                </button>
              </div>
            ))}
            <button type="button" onClick={handleAddHorario} className={styles.button}>
              Agregar Horario
            </button>
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={handlePreviousStep} className={styles.button}>
              Anterior
            </button>
            <button type="submit" className={styles.button}>
              Registrar Veterinario
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default RegisterVeterinario;
