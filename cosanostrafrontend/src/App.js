import React, { useState } from 'react';
import Login from "./components/Login";
import Register from "./components/Register";
import HeroLandingPage from "./components/HeroLandingPage";
import Schedule from "./components/Schedule";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BarberLogin from "./components/BarberLogin";
import BarberDashboard from "./components/BarberDashboard";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Appointments from "./components/Appointments";
import Navbar from "./components/Navbar";
import useAuth from './hooks/useAuth';  // Import the custom hook
import PersistLogin from './components/PersistLogin';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Assume the user is logged in initially

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<HeroLandingPage />} />
        <Route path="/login" element={<Login isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/barber-login" element={<BarberLogin />} />
        <Route element={<PersistLogin/>}> 
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/barber-dashboard" element={<BarberDashboard />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/success" element={<Success />} />
          <Route path="/appointments" element={<Appointments />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
