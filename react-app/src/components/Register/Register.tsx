import React from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../Menu/Menu';
import './Register.css'; // Si prefieres separar los estilos específicos del componente

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
      <div className="center-container">
        <h1 className="title">Bienvenido a Vetify</h1>
        <h3 className="title" style={{ marginBottom: '30px' }}>
          Selecciona un tipo de registro
        </h3>

        <div className="button-group">
          <button onClick={handleUserRegister} className="button">
            Usuario
          </button>
          <button onClick={handleVetRegister} className="button">
            Veterinario
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;
