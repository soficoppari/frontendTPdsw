import React, { useState, useEffect, useRef } from 'react';
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

const HORAS = Array.from({ length: 24 }).map((_, i) => i.toString().padStart(2, '0'));
const MINUTOS = ['00', '15', '30', '45'];

const RegisterVeterinario: React.FC = () => {
  const [matricula, setMatricula] = useState<number | null>(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [nroTelefono, setNroTelefono] = useState('');

  const [especies, setEspecies] = useState<Especie[]>([]);
  const [especiesSeleccionadas, setEspeciesSeleccionadas] = useState<Especie[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const [horarios, setHorarios] = useState<Horario[]>([
    { dia: '', inicio: '08:00', fin: '17:00' },
  ]);
  const [horariosEditados, setHorariosEditados] = useState<boolean[]>([true]); // true = editando, false = resumen

  const [email, setEmail] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [matriculaError, setMatriculaError] = useState('');
  const [matriculaOk, setMatriculaOk] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchEspecies = async () => {
      try {
        const response = await fetch('https://backendtpdswproduction7bb3.up.railway.app/api/especie');
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

  // Verificar matrícula con debounce al escribir
  const handleMatriculaChange = (value: string) => {
    const num = Number(value);
    setMatricula(num || null);
    setMatriculaOk(false);
    setMatriculaError('');

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!value || isNaN(num) || num <= 0) return;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`https://backendtpdswproduction7bb3.up.railway.app/api/veterinario/check-matricula/${num}`);
        const data = await res.json();
        if (data.disponible) {
          setMatriculaOk(true);
          setMatriculaError('');
        } else {
          setMatriculaOk(false);
          setMatriculaError('La matrícula ya está registrada');
        }
      } catch {
        // silencioso si hay error de red
      }
    }, 600);
  };

  const toggleDropdown = () => setDropdownVisible(!dropdownVisible);

  const handleSelectEspecie = (especie: Especie) => {
    setEspeciesSeleccionadas((prev) => {
      const nuevas = [...prev, especie];
      // Si después de agregar, ya están todas seleccionadas, cerrar dropdown
      if (nuevas.length === especies.length) {
        setDropdownVisible(false);
      }
      return nuevas;
    });
  };

  const handleDeselectEspecie = (id: number) => {
    setEspeciesSeleccionadas(especiesSeleccionadas.filter((e) => e.id !== id));
  };

  const handleAddHorario = () => {
    setHorarios([...horarios, { dia: '', inicio: '08:00', fin: '17:00' }]);
    setHorariosEditados([...horariosEditados, true]);
  };

  const handleHorarioEdit = (index: number, editando: boolean) => {
    const nuevosEditados = [...horariosEditados];
    nuevosEditados[index] = editando;
    setHorariosEditados(nuevosEditados);
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
    setHorariosEditados(horariosEditados.filter((_, i) => i !== index));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!matricula || !nombre || !apellido || !direccion || !nroTelefono) {
        setError('Por favor, completa todos los campos del paso 1.');
        return;
      }
      if (matriculaError) {
        setError('Corregí la matrícula antes de continuar.');
        return;
      }
    }
    if (step === 2 && especiesSeleccionadas.length === 0) {
      setError('Selecciona al menos una especie.');
      return;
    }
    if (step === 3) {
      // Validar que todos los horarios estén confirmados (no editando)
      const todosConfirmados = horariosEditados.every((editando) => editando === false);
      if (!todosConfirmados || horarios.length === 0) {
        setError('Por favor completa y confirma todos los horarios antes de continuar.');
        return;
      }
    }
    setError('');
    setStep((prev) => prev + 1);
    if (step === 4) return;
  };

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !contrasenia || !confirmarContrasenia) {
      setError('Completa todos los campos del paso 4.');
      return;
    }

    if (!email.endsWith('.com')) {
      setError('El email debe ser válido y terminar en .com');
      return;
    }

    if (contrasenia !== confirmarContrasenia) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const diaSemanaMap: Record<string, number> = {
      Domingo: 0,
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
    };

    const formattedHorarios = horarios.map((h) => ({
      diaSemana: diaSemanaMap[h.dia],
      horaInicio: h.inicio, // "08:00"
      horaFin: h.fin,       // "17:00"
    }));

    try {
      const response = await fetch('https://backendtpdswproduction7bb3.up.railway.app/api/veterinario', {
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

  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.title}>Registro de Veterinario</h2>

      {/* Progreso */}
      <div className={styles.progressContainer}>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className={`${styles.step} ${step >= s ? styles.activeStep : ''}`}>
            <div className={styles.circle}>{s}</div>
            {s < 4 && <div className={styles.line}></div>}
          </div>
        ))}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>¡Registro exitoso! Redirigiendo al login...</p>}

      {/* Paso 1 */}
      {step === 1 && (
        <form className={styles.registerForm}>
          <div className={styles.formColumn}>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={matricula || ''}
                onChange={(e) => handleMatriculaChange(e.target.value)}
                className={`${styles.input} ${matriculaError ? styles.inputError : ''} ${matriculaOk ? styles.inputOk : ''}`}
                placeholder="Matrícula"
              />
              {matriculaError && (
                <p className={styles.fieldError}>⚠ {matriculaError}</p>
              )}
              {matriculaOk && (
                <p className={styles.fieldOk}>✓ Matrícula disponible</p>
              )}
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={styles.input}
                placeholder="Nombre"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                className={styles.input}
                placeholder="Apellido"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className={styles.input}
                placeholder="Dirección"
              />
            </div>
            <div className={styles.formGroup}>
              <input
                type="text"
                value={nroTelefono}
                onChange={(e) => setNroTelefono(e.target.value.replace(/\D/g, ''))}
                className={styles.input}
                placeholder="Número de Teléfono"
              />
            </div>
          </div>
        </form>
      )}


      {/* Paso 2 */}
      {step === 2 && (
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Especies</label>

            {/* Caja de selección */}
            <div className={styles.selectContainer} onClick={toggleDropdown}>
              {especiesSeleccionadas.length === 0
                ? "Selecciona especie..."
                : "Agregar otra especie"}
              <div className={styles.dropdownArrow}>▼</div>
            </div>

            {/* Dropdown */}
            {dropdownVisible && (
              <div className={styles.dropdown}>
                {especies
                  .filter((especie) => !especiesSeleccionadas.some((e) => e.id === especie.id))
                  .map((especie) => (
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

            {/* Seleccionados */}
            <div className={styles.selectedItems}>
              {especiesSeleccionadas.map((especie) => (
                <div key={especie.id} className={styles.selectedItem}>
                  {especie.nombre}
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => handleDeselectEspecie(especie.id)}
                    aria-label="Quitar especie"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}

      {/* Paso 3 */}
      {step === 3 && (
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Horarios</label>
            {/* Solo mostrar el error aquí en el paso 3 */}
            {horarios.map((horario, index) => {
              // días disponibles permitiendo hasta 3 franjas por día
              const diasDisponibles = [
                'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
              ].filter(
                (dia) => {
                  const count = horarios.filter((h, i) => i !== index && h.dia === dia).length;
                  return dia === horario.dia || count < 3;
                }
              );

              // Formato resumen: Lunes 8am-4pm
              const resumenHorario = () => {
                if (!horario.dia || !horario.inicio || !horario.fin) return '';
                const formatHora = (h: string) => {
                  const [hh, mm] = h.split(':');
                  let hour = parseInt(hh, 10);
                  const ampm = hour >= 12 ? 'pm' : 'am';
                  hour = hour % 12 || 12;
                  return `${hour}${mm !== '00' ? ':' + mm : ''}${ampm}`;
                };
                return `${horario.dia} ${formatHora(horario.inicio)}-${formatHora(horario.fin)}`;
              };

              let horarioError = '';
              if (horario.dia && horario.inicio && horario.fin) {
                if (horario.inicio >= horario.fin) {
                  horarioError = 'La hora de inicio debe ser menor a la hora de fin.';
                } else {
                  const overlap = horarios.some(
                    (h, i) =>
                      i !== index &&
                      h.dia === horario.dia &&
                      horario.inicio < h.fin &&
                      horario.fin > h.inicio
                  );
                  if (overlap) {
                    horarioError = 'El horario se superpone con otra franja del mismo día.';
                  }
                }
              }

              // Validar si el horario es válido para habilitar el botón verde
              const isHorarioValido =
                horario.dia !== '' &&
                horario.inicio !== '' &&
                horario.fin !== '' &&
                horarioError === '';

              return (
                <div key={index} className={styles.horarioGroup}>
                  {horariosEditados[index] ? (
                    <>
                      {/* Dropdown Día */}
                      <select
                        value={horario.dia}
                        onChange={(e) => handleHorarioChange(index, 'dia', e.target.value)}
                        className={styles.select}
                      >
                        <option value="" disabled>
                          Día
                        </option>
                        {diasDisponibles.map((dia) => (
                          <option key={dia} value={dia}>
                            {dia}
                          </option>
                        ))}
                      </select>

                      {/* Inputs de hora */}
                      <div className={styles.horariosFullRow}>
                        <label className={styles.timeLabel}>
                          Hora de Inicio
                          <div className={styles.timeSelectContainer}>
                            <select
                              className={styles.timeSelect}
                              value={horario.inicio.split(':')[0]}
                              onChange={(e) => handleHorarioChange(index, 'inicio', `${e.target.value}:${horario.inicio.split(':')[1]}`)}
                            >
                              {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span className={styles.timeSeparator}>:</span>
                            <select
                              className={styles.timeSelect}
                              value={horario.inicio.split(':')[1]}
                              onChange={(e) => handleHorarioChange(index, 'inicio', `${horario.inicio.split(':')[0]}:${e.target.value}`)}
                            >
                              {MINUTOS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </label>
                        <label className={styles.timeLabel}>
                          Hora Fin
                          <div className={styles.timeSelectContainer}>
                            <select
                              className={styles.timeSelect}
                              value={horario.fin.split(':')[0]}
                              onChange={(e) => handleHorarioChange(index, 'fin', `${e.target.value}:${horario.fin.split(':')[1]}`)}
                            >
                              {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
                            </select>
                            <span className={styles.timeSeparator}>:</span>
                            <select
                              className={styles.timeSelect}
                              value={horario.fin.split(':')[1]}
                              onChange={(e) => handleHorarioChange(index, 'fin', `${horario.fin.split(':')[0]}:${e.target.value}`)}
                            >
                              {MINUTOS.map((m) => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </label>
                      </div>
                      {horarioError && (
                        <p className={styles.fieldError} style={{ marginTop: '0.2rem', marginBottom: '0.5rem', textAlign: 'center' }}>
                          ⚠ {horarioError}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className={styles.horariosFullRow}>
                      <span className={styles.horarioResumen}>{resumenHorario()}</span>
                    </div>
                  )}
                  {/* Botones debajo */}
                  <div className={styles.deleteButtonRow} style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveHorario(index)}
                      className={styles.deleteIconButton}
                      aria-label="Eliminar horario"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9 3a3 3 0 0 1 6 0h5a1 1 0 1 1 0 2h-1v15a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5H4a1 1 0 1 1 0-2h5Zm8 2H7v15a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5Zm-5 3a1 1 0 0 1 2 0v8a1 1 0 1 1-2 0V8Zm-2 0a1 1 0 0 1 2 0v8a1 1 0 1 1-2 0V8Z" />
                      </svg>
                    </button>
                    {horariosEditados[index] ? (
                      <button
                        type="button"
                        className={styles.confirmIconButton}
                        style={{
                          background: isHorarioValido ? '#28a745' : '#bdbdbd',
                          borderRadius: '6px',
                          border: 'none',
                          padding: '0.3rem 0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: isHorarioValido ? 'pointer' : 'not-allowed'
                        }}
                        onClick={() => isHorarioValido && handleHorarioEdit(index, false)}
                        aria-label="Confirmar horario"
                        disabled={!isHorarioValido}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#fff" viewBox="0 0 24 24">
                          <path d="M20.285 6.709a1 1 0 0 0-1.414-1.418l-9.192 9.192-4.243-4.242a1 1 0 1 0-1.414 1.414l4.95 4.95a1 1 0 0 0 1.414 0l9.899-9.896z" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.editIconButton}
                        style={{ background: '#ffc107', borderRadius: '6px', border: 'none', padding: '0.3rem 0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleHorarioEdit(index, true)}
                        aria-label="Editar horario"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#fff" viewBox="0 0 24 24">
                          <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.54-2.54a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.62z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Botón agregar */}
            <button
              type="button"
              onClick={handleAddHorario}
              className={styles.button}
              disabled={horarios.length >= 21}
              style={{
                background: horarios.length >= 21 ? '#bdbdbd' : undefined,
                cursor: horarios.length >= 21 ? 'not-allowed' : 'pointer'
              }}
            >
              Agregar Horario
            </button>
          </div>
        </form>
      )}

      {/* Paso 4 */}
      {step === 4 && (
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.formGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="Email"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              className={styles.input}
              placeholder="Contraseña"
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type="password"
              value={confirmarContrasenia}
              onChange={(e) => setConfirmarContrasenia(e.target.value)}
              className={styles.input}
              placeholder="Confirmar Contraseña"
            />
          </div>
        </form>
      )}

      {/* Botones siempre abajo */}
      <div className={styles.buttonGroup}>
        {step > 1 && (
          <button type="button" onClick={handlePreviousStep} className={styles.button}>
            Anterior
          </button>
        )}
        {step < 4 && (
          <button type="button" onClick={handleNextStep} className={styles.button}>
            Siguiente
          </button>
        )}
        {step === 4 && (
          <button type="button" onClick={handleRegister} className={styles.button}>
            Registrar Veterinario
          </button>
        )}
      </div>
    </div>
  );
};

export default RegisterVeterinario;
