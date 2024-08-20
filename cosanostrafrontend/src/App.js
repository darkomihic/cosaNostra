import React, { useState } from 'react'; // Ensure useState is imported here
import Login from "./components/Login";
import Register from "./components/Register"
import HeroLandingPage from "./components/HeroLandingPage";
import Schedule from "./components/Schedule";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BarberLogin from "./components/BarberLogin";
import BarberDashboard from "./components/BarberDashboard";
import Success from "./components/Success"
import Cancel from "./components/Cancel"
import Appointments from "./components/Appointments"
import Navbar from "./components/Navbar";

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };


  return (
    <>
        <Router>
          <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
          <Routes>
            <Route path="/" element={<HeroLandingPage />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/barber-login" element={<BarberLogin />} />
            <Route path="/barber-dashboard" element={<BarberDashboard />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/success" element={<Success />} />
            <Route path="/appointments" element={<Appointments />} />
          </Routes>
        </Router>
    </>
  );
}

export default App; 
