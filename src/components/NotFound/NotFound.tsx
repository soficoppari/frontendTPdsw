import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.paw}>🐾</div>
                <h1 className={styles.code}>404</h1>
                <h2 className={styles.title}>Página no encontrada</h2>
                <p className={styles.subtitle}>
                    Parece que tu mascota se perdió por aquí... <br />
                    Esta página no existe o fue movida.
                </p>
                <div className={styles.buttons}>
                    <button className={styles.btnPrimary} onClick={() => navigate('/')}>
                        Volver al inicio
                    </button>
                    <button className={styles.btnSecondary} onClick={() => navigate(-1)}>
                        Volver atrás
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
