import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from './Menu';

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleUserRegister = () => {
    navigate('/registerUsuario');
  };

  const handleVetRegister = () => {
    navigate('/registerVeterinario');
  };

  return (
    <>
      <Menu />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Centrar verticalmente
          height: '70vh', // Ajusta la altura
          margin: '0', // Elimina márgenes
          color: 'white', // Texto por defecto en blanco
        }}
      >
        <h1 style={{ textAlign: 'center', color: 'white' }}>Bienvenido a Vetify</h1>
        <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>
          Selecciona un tipo de registro
        </h3>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={handleUserRegister}
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Usuario
          </button>

          <button
            onClick={handleVetRegister}
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Veterinario
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
