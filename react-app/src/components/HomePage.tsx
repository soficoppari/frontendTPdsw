import React from 'react';
import Menu from './Menu'; // Asegúrate de que la ruta sea correcta

const HomePage: React.FC = () => {
  return (
    <>
      <Menu />
      <div style={styles.colorContainer} />
    </>
  );
};

const styles = {
  colorContainer: {
    width: '100%',
    height: '100vh',
    backgroundColor: '#f0f0f0', // Cambia este color según lo que necesites
    marginTop: '80px', // Asegúrate de dejar espacio para el menú
  },
};

export default HomePage;
