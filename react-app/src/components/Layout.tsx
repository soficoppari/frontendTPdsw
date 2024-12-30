import React from 'react';
import Menu from './Menu/Menu';

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
    marginTop: '1px', // Deja espacio para el menú
    width: '100%',
    height: '1vh', // Ajusta la altura para el contenido
  },
};

export default Layout;
