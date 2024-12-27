import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import RegisterUsuario from './components/RegisterUsuario';
import MascotasList from './components/Mascotas';
import AddMascota from './components/AddMascota';
import VeterinariosList from './components/Veterinarios';
import RegisterVeterinario from './components/RegisterVeterinario';
import Layout from './components/Layout'; // Asegúrate de que la ruta sea correcta
import Perfil from './components/Perfil';
import Register from './components/Register';
import AddTurno from './components/AddTurno';
import Turnos from './components/Turnos';
import PerfilVeterinario from './components/PerfilVeterinario';
import TurnosVeterinario from './components/TurnosVeterinario';
import './App.css';
import { AuthProvider } from './context/AuthContext'; // Importa el proveedor
import Menu from './components/Menu';
import CalificarTurno from './components/CalificarTurno';
import CalificacionesVeterinario from './components/CalificacionesVeterinario';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Menu />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registerUsuario" element={<RegisterUsuario />} />
            <Route
              path="/registerVeterinario"
              element={<RegisterVeterinario />}
            />
            <Route path="/Mascotas" element={<MascotasList />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/AddTurno/:id" element={<AddTurno />} />
            <Route path="/register" element={<Register />} />
            <Route path="/Turnos" element={<Turnos />} />
            <Route
              path="CalificacionesVeterinario"
              element={<CalificacionesVeterinario />}
            />
            <Route path="/Addmascota" element={<AddMascota />} />
            <Route path="/Veterinarios" element={<VeterinariosList />} />
            <Route path="perfilVeterinario" element={<PerfilVeterinario />} />
            <Route path="/TurnosVeterinario" element={<TurnosVeterinario />} />
            <Route
              path="CalificarTurno/:turnoId"
              element={<CalificarTurno />}
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
