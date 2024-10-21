import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, []);

  const handleLoginClick = () => {
    navigate('/Login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClick = (option: string) => {
    setIsMenuOpen(false);
    alert(`Seleccionaste: ${option}`);
  };

  const handleLogoutClick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setEmail(null);
    setIsMenuOpen(false);
    navigate('/Login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>PetWorld</h1>
        <div style={styles.buttons}>
          {email ? (
            <>
              <div style={styles.profileButton} onClick={toggleMenu}>
                <span style={styles.profileIcon}>👤</span>
              </div>
              {isMenuOpen && (
                <div style={styles.sideMenu}>
                  <ul>
                    <li onClick={() => handleMenuClick('Mi Perfil')}>
                      Mi Perfil
                    </li>
                    <li onClick={() => handleMenuClick('Mis Mascotas')}>
                      Mis Mascotas
                    </li>
                    <li onClick={handleLogoutClick} style={styles.logoutButton}>
                      Cerrar Sesión
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <button style={styles.button} onClick={handleLoginClick}>
              Login
            </button>
          )}
        </div>
      </div>
      <div style={styles.imageContainer}>
        <img
          src="/images/fondo.webp"
          alt="Fondo de PetWorld"
          style={styles.image}
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative' as const,
    height: '100vh',
    overflow: 'hidden',
  },
  header: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
  },
  title: {
    margin: 0,
    fontSize: '24px',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  profileButton: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#007bff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#fff',
    fontSize: '20px',
  },
  profileIcon: {
    fontSize: '20px',
  },
  sideMenu: {
    position: 'absolute' as const,
    top: '60px',
    right: '10px',
    width: '200px',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '10px',
    borderRadius: '8px',
    zIndex: 1000,
  },
  logoutButton: {
    marginTop: '10px',
    color: 'red',
    cursor: 'pointer',
  },
  imageContainer: {
    marginTop: '80px',
    width: '100%',
    height: 'calc(100vh - 80px)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as React.CSSProperties,
};

export default HomePage;
