import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'; // Assuming useAuth hook is in place

const Navbar = ({ isLoggedIn }) => {
  const [currentUser, setCurrentUser] = useState(null); // To store the logged-in user details
  const navigate = useNavigate();
  const { logout } = useAuth(); // Assuming a logout function exists in your Auth context

  // Effect hook to check if the user is logged in based on the accessToken in sessionStorage
  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      // Optionally fetch user data from your API or use context data
      // setCurrentUser(fetchUserData(accessToken)); // Example: Get user details
    }
  }, [isLoggedIn]);

  // Handle logout
  const handleLogout = () => {
    logout(); // Assuming the logout function clears the auth state and tokens
    sessionStorage.removeItem('accessToken');
    navigate('/login'); // Redirect to login after logging out
  };

  return (
    <nav className="bg-blue-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg font-bold">Barbershop</Link>
        
        <ul className="flex space-x-6">
          <li>
            <Link to="/" className="hover:text-gray-300">Home</Link>
          </li>
          <li>
            <Link to="/schedule" className="hover:text-gray-300">Schedule</Link>
          </li>
          <li>
            <Link to="/appointments" className="hover:text-gray-300">Appointments</Link>
          </li>

          {/* Render login and register links if not logged in */}
          {!isLoggedIn ? (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300">Register</Link>
              </li>
            </>
          ) : (
            <>
              {/* Render profile and logout if logged in */}
              <li>
                <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:text-gray-300">Logout</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
