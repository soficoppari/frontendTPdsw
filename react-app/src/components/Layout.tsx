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
    width: '100%',
    padding: '1rem',
  },
};

export default Layout;
