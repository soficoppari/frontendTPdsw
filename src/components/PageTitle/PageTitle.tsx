import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Vetify',
  '/login': 'Vetify - Iniciar Sesión',
  '/register': 'Vetify - Registro',
  '/registerUsuario': 'Vetify - Registro de Usuario',
  '/registerVeterinario': 'Vetify - Registro de Veterinario',
  '/perfil': 'Vetify - Mi Perfil',
  '/Mascotas': 'Vetify - Mis Mascotas',
  '/Addmascota': 'Vetify - Agregar Mascota',
  '/Veterinarios': 'Vetify - Veterinarios',
  '/Turnos': 'Vetify - Mis Turnos',
  '/perfilVeterinario': 'Vetify - Perfil Veterinario',
  '/TurnosVeterinario': 'Vetify - Turnos',
  '/CalificacionesVeterinario': 'Vetify - Calificaciones',
};

const PageTitle: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Buscar coincidencia exacta primero, luego por prefijo para rutas dinámicas
    const exactTitle = routeTitles[location.pathname];

    if (exactTitle) {
      document.title = exactTitle;
    } else if (location.pathname.startsWith('/AgendarTurno/')) {
      document.title = 'Vetify - Agendar Turno';
    } else if (location.pathname.startsWith('/CalificarTurno/')) {
      document.title = 'Vetify - Calificar Turno';
    } else if (location.pathname.startsWith('/CompletarAtencion/')) {
      document.title = 'Vetify - Completar Atención';
    } else if (location.pathname.startsWith('/ResumenTurno/')) {
      document.title = 'Vetify - Resumen de Turno';
    } else {
      document.title = 'Vetify';
    }
  }, [location.pathname]);

  return null;
};

export default PageTitle;
