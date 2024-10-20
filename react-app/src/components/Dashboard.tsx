import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Simulamos la decodificación de un JWT
      setUsername(decodedToken.username);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {username ? <p>Hello, {username}!</p> : <p>Loading...</p>}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
