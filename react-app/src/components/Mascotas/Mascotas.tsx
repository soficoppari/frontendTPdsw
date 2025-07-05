import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Mascotas.module.css';


type Usuario = {
  id: number;
  nombre: string;
};

type Raza = {
  id: number;
  nombre: string;
  especie: {
    id: number;
    nombre: string;
  };
};

type Mascota = {
  id: number;
  nombre: string;
  fechaNacimiento: string;
  usuario: Usuario;
  raza: Raza;
};

const Mascotas: React.FC = () => {
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMascotas = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Verifica que el token no sea null o undefined

      try {
        const response = await axios.get('http://localhost:3000/api/mascota', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMascotas(response.data.data);
      } catch (err) {
        console.error('Error al obtener las mascotas:', err); // Imprime el error
        setError('Error al obtener las mascotas');
      }
    };

    fetchMascotas();
  }, []);

  const handleAddMascota = () => {
    navigate('/AddMascota');
  };

  const handleAgendarTurno = (mascotaId: number, especieId: number) => {
    // Guardar el ID de la mascota en el localStorage
    localStorage.setItem('mascotaId', mascotaId.toString());
    // Guardar el ID de la especie de la mascota en el localStorage
    localStorage.setItem('especieMascota', especieId.toString());
    // Navegar a la página de veterinarios
    navigate('/Veterinarios');
  };
  //catch
  return (
  <>
    <div className={styles.container}>
      <h2 className={styles.title}>Tus Mascotas</h2>

      {error && <p className={styles.error}>{error}</p>}

      {mascotas.length === 0 ? (
        <p>No has ingresado ninguna mascota aún.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Fecha de Nacimiento</th>
              <th>Raza</th>
              <th>Especie</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((mascota) => (
              <tr key={mascota.id}>
                <td>{mascota.nombre}</td>
                <td>{mascota.fechaNacimiento}</td>
                <td>{mascota.raza.nombre}</td>
                <td>{mascota.raza.especie.nombre}</td>
                <td>
                  <button
                    className={styles.actionButton}
                    onClick={() =>
                      handleAgendarTurno(mascota.id, mascota.raza.id)
                    }
                  >
                    Agendar Turno
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button className={styles.addButton} onClick={handleAddMascota}>
        Agregar nueva mascota
      </button>
    </div>
  </>
);
};

export default Mascotas;
