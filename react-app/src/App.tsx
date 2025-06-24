import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Login from './components/Login/Login';
import RegisterUsuario from './components/RegisterUsuario/RegisterUsuario';
import MascotasList from './components/Mascotas';
import AddMascota from './components/addMascota/AddMascota';
import VeterinariosList from './components/Veterinarios';
import RegisterVeterinario from './components/RegisterVeterinario/RegisterVeterinario';
import Layout from './components/Layout'; // Asegúrate de que la ruta sea correcta
import Perfil from './components/Perfil';
import Register from './components/Register/Register';
import AddTurno from './components/AddTurno';
import Turnos from './components/Turnos';
import PerfilVeterinario from './components/PerfilVeterinario';
import TurnosVeterinario from './components/TurnosVeterinario';
import './Styles/App.css';
import './Styles/Reset.css';
import './Styles/Variables.css';
import { AuthProvider } from './context/AuthContext'; // Importa el proveedor
import CalificarTurno from './components/CalificarTurno';
import CalificacionesVeterinario from './components/CalificacionesVeterinario';

const App: React.FC = () => {
  return (
    <AuthProvider>
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registerUsuario" element={<RegisterUsuario />} />
        <Route path="/registerVeterinario" element={<RegisterVeterinario />} />
        <Route path="/Mascotas" element={<MascotasList />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/AddTurno/:id" element={<AddTurno />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Turnos" element={<Turnos />} />
        <Route path="/Addmascota" element={<AddMascota />} />
        <Route path="/Veterinarios" element={<VeterinariosList />} />
        <Route path="/perfilVeterinario" element={<PerfilVeterinario />} />
        <Route path="/TurnosVeterinario" element={<TurnosVeterinario />} />
        <Route path="/CalificacionesVeterinario" element={<CalificacionesVeterinario />} />
        <Route path="/CalificarTurno/:turnoId" element={<CalificarTurno />} />
      </Routes>
    </Layout>
  </Router>
</AuthProvider>
  );
};

export default App;
