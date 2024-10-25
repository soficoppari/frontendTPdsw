import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import Login from './components/Login';
import Dashboard from './components/Dashboard.tsx';
import Register from './components/Register';
import MascotasList from './components/MascotasList.tsx';
import AddMascota from './components/AddMascota.tsx';
import VeterinariasList from './components/VeterinariasList.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/MascotasList" element={<MascotasList />} />
        <Route path="/Addmascota" element={<AddMascota />} />
        <Route path="/veterinaria" element={<VeterinariasList />} />
      </Routes>
    </Router>
  );
};

export default App;
