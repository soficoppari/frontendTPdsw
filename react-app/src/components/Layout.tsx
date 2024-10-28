import React from 'react';
import Menu from './Menu';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <Menu />
      <div style={styles.content}>{children}</div>
    </>
  );
};

const styles = {
  content: {
    marginTop: '80px', // Deja espacio para el menú
    width: '100%',
    height: 'calc(100vh - 80px)', // Ajusta la altura para el contenido
    backgroundColor: '#f0f0f0', // Color de fondo para el contenido
  },
};

export default Layout;
