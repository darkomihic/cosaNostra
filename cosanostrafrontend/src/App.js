import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider'; // AuthProvider that provides authentication context
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import HeroLandingPage from './components/HeroLandingPage';
import Schedule from './components/Schedule';
import Appointments from './components/Appointments';
import Success from './components/Success';
import Cancel from './components/Cancel';
import Footer from './components/Footer';

function App() {
  // State to track if the user is logged in based on the auth token
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in based on accessToken stored in sessionStorage
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken); // Set login state based on presence of access token
  }, []);

  return (
    <AuthProvider> {/* Wrap the app with AuthProvider to make auth data available globally */}
      <Router>
        <Navbar isLoggedIn={isLoggedIn} /> {/* Pass the login state to Navbar */}
        <Routes>
          <Route path="/" element={<HeroLandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />
        </Routes>
        <Footer /> {/* Footer for the page */}
      </Router>
    </AuthProvider>
  );
}

export default App;
