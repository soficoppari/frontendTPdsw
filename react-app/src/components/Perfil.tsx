import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Menu from './Menu';

interface Usuario {
  nombre: string;
  apellido: string;
  email: string;
  nroTelefono: number;
}

interface DecodedToken {
  id: number; // Ajusta según sea necesario
}

const Perfil: React.FC = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No hay sesión activa');
        setLoading(false);
        return;
      }

      // Decodificar el token para obtener el ID del usuario
      const decoded = jwtDecode<DecodedToken>(token); // Usar jwtDecode

      if (!decoded || !decoded.id) {
        setError('Token no válido');
        setLoading(false);
        return;
      }

      const userId = decoded.id;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/usuario/${userId}`
        );
        setUsuario(response.data.data); // Ajusta según la estructura de tu respuesta
      } catch (err) {
        setError('Error al cargar los datos del usuario');
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!usuario) {
    return <div>No se encontraron datos de usuario.</div>;
  }

  return (
    <>
      <Menu />
      <div style={styles.container}>
        <h1 style={styles.title}>Perfil del Usuario</h1>
        <div style={styles.card}>
          <div style={styles.cardItem}>
            <strong>Nombre:</strong> {usuario.nombre}
          </div>
          <div style={styles.cardItem}>
            <strong>Apellido:</strong> {usuario.apellido}
          </div>
          <div style={styles.cardItem}>
            <strong>Email:</strong> {usuario.email}
          </div>
          <div style={styles.cardItem}>
            <strong>Número de Teléfono:</strong> {usuario.nroTelefono}
          </div>
        </div>
        <button style={styles.logoutButton} onClick={handleLogout}>
          Cerrar Sesión
        </button>
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '80px',
    maxWidth: '600px',
    margin: 'auto',
    textAlign: 'left' as const,
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
  },
  title: {
    marginBottom: '20px',
    color: '#fff',
  },
  card: {
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#e7f1ff',
  },
  cardItem: {
    padding: '10px 0',
    borderBottom: '1px solid #ccc',
  },
  logoutButton: {
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#ff4d4d',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginTop: '20px',
  },
};

export default Perfil;
