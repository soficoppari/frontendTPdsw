import React, { useEffect, useState } from 'react';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastProps {
    toasts: ToastMessage[];
    onRemove: (id: number) => void;
}

const icons: Record<ToastType, string> = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
};

const Toast: React.FC<ToastProps> = ({ toasts, onRemove }) => {
    return (
        <div className={styles.toastContainer}>
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: (id: number) => void }> = ({
    toast,
    onRemove,
}) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Trigger enter animation
        requestAnimationFrame(() => setVisible(true));

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => onRemove(toast.id), 350);
        }, 3500);

        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    return (
        <div
            className={`${styles.toast} ${styles[toast.type]} ${visible ? styles.visible : ''}`}
            onClick={() => {
                setVisible(false);
                setTimeout(() => onRemove(toast.id), 350);
            }}
        >
            <span className={styles.icon}>{icons[toast.type]}</span>
            <span className={styles.message}>{toast.message}</span>
        </div>
    );
};

// Hook para usar toasts fácilmente
export function useToast() {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const addToast = (message: string, type: ToastType = 'info') => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return { toasts, addToast, removeToast };
}

export default Toast;
