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

const App: React.FC = () => {
  return (
    <Router>
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
          <Route path="/Addmascota" element={<AddMascota />} />
          <Route path="/Veterinarios" element={<VeterinariosList />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
