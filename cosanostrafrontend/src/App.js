import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from "./components/Navbar";
import { AuthProvider } from './components/AuthContext';
import Login from "./components/Login";
import Register from "./components/Register";
import HeroLandingPage from "./components/HeroLandingPage";
import Schedule from "./components/Schedule";
import BarberLogin from "./components/BarberLogin";
import BarberDashboard from "./components/BarberDashboard";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import Appointments from "./components/Appointments";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HeroLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/barber-login" element={<BarberLogin />} />
          <Route path="/barber-dashboard" element={<BarberDashboard />} />
          <Route path="/cancel" element={<Cancel />} />
          <Route path="/success" element={<Success />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
