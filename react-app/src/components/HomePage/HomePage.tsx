import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './HomePage.module.css';

const MAPS_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.9!2d-60.6505!3d-32.9442!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b7ab4c3b1b1b1b%3A0x0!2sEntre%20R%C3%ADos%201702%2C%20Rosario%2C%20Santa%20Fe!5e0!3m2!1ses!2sar!4v1700000000000!5m2!1ses!2sar';

const MAPS_LINK =
  'https://www.google.com/maps/search/?api=1&query=Entre+Rios+1702,+Rosario,+Santa+Fe,+Argentina';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useAuth();

  // ---- Vista loggeada ----
  if (isLoggedIn) {
    const bienvenida =
      role === 'veterinario'
        ? '¡Bienvenido de vuelta, veterinario!'
        : '¡Bienvenido de vuelta!';

    return (
      <div className={styles.dashboardWrapper}>
        <div className={styles.dashboardInner}>
          {/* Hero compacto */}
          <div className={styles.dashboardHero}>
            <img src="/images/LogoVet.png" alt="Vetify" className={styles.dashLogo} />
            <h1 className={styles.dashTitle}>{bienvenida}</h1>
            <p className={styles.dashSubtitle}>Tu espacio de salud animal en Rosario</p>
          </div>

          <div className={styles.sectionsGrid}>
            {/* ¿Quiénes somos? */}
            <section className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <span className={styles.infoIcon}>🐾</span>
                <h2 className={styles.infoCardTitle}>¿Quiénes somos?</h2>
              </div>
              <p className={styles.infoCardText}>
                Salud, bienestar y prevención en un solo lugar. Vetify nace para transformar
                el cuidado veterinario en Rosario, ofreciendo soluciones médicas de alta calidad
                con un compromiso inquebrantable por la vida animal.
              </p>
            </section>

            {/* ¿Dónde nos encontramos? */}
            <section className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <span className={styles.infoIcon}>📍</span>
                <h2 className={styles.infoCardTitle}>¿Dónde nos encontramos?</h2>
              </div>
              <p className={styles.infoCardText}>
                Estamos en <strong>Entre Ríos 1702, Rosario</strong>. Hacé click en el mapa
                para abrir Google Maps con la dirección exacta.
              </p>
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mapWrapper}
                title="Abrir en Google Maps"
              >
                <iframe
                  src={MAPS_EMBED_URL}
                  className={styles.mapIframe}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación Vetify - Entre Ríos 1702, Rosario"
                />
                <div className={styles.mapOverlay}>
                  <span className={styles.mapOverlayText}>📍 Abrir en Google Maps</span>
                </div>
              </a>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // ---- Vista no loggeada (hero original) ----
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.heroImageWrapper}>
        <img
          src="/images/perros-hero.jpg"
          alt="Perros felices en el parque"
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.heroContent}>
        <div className={styles.logoRow}>
          <img
            src="/images/LogoVet.png"
            alt="Vetify Logo"
            className={styles.logoImage}
          />
          <h1 className={styles.brand}>Vetify</h1>
        </div>

        <p className={styles.subtitle}>Tu mascota, nuestra prioridad en cada consulta</p>

        <div className={styles.ctaButtons}>
          <button className={styles.btnPrimary} onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className={styles.btnSecondary} onClick={() => navigate('/register')}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
