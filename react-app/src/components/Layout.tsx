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
    marginTop: '60px',
    width: '100%',
    padding: '1rem',
    minHeight: 'calc(100vh - 60px)', // Altura ajustada a lo visible
  },
};

export default Layout;
