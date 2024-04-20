import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Routes, Route, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider '; // Corrected import path
import AppointmentsTable from './AppointmentsTable';
import AddDoctorsDepartments from './AddDoctorsDepartments';
import DashMain from './DashMain';
import Advertisement from './Advertisement';

function Dashboard() {
  const { currentUser } = useContext(AuthContext); // Using useContext to access AuthContext value
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate hook to handle navigation
  const [logoutTimer, setLogoutTimer] = useState(null);

  // Function to handle logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUser'); // Remove user from localStorage
    clearTimeout(logoutTimer); // Clear the logout timer
    navigate('/login'); // Navigate to login page
  }, [logoutTimer, navigate]); // Include logoutTimer and navigate in the dependency array

  // Function to reset the logout timer
  const resetLogoutTimer = useCallback(() => {
    clearTimeout(logoutTimer); // Clear the existing timeout
    const newTimer = setTimeout(() => {
      handleLogout(); // Logout user after timeout
    }, 30 * 60 * 1000); // Timeout after 30 minutes of inactivity (30 minutes * 60 seconds * 1000 milliseconds)
    return newTimer; // Return the new timer
  }, [logoutTimer, handleLogout]); // Include logoutTimer and handleLogout in the dependency array

  // Handle user activity
  const handleActivity = useCallback(() => {
    const newTimer = resetLogoutTimer(); // Reset the logout timer on user activity
    setLogoutTimer(newTimer); // Set the new timer
  }, [resetLogoutTimer]); // Include resetLogoutTimer in the dependency array

  // Effect to start the logout timer when component mounts or user activity changes
  useEffect(() => {
    const newTimer = resetLogoutTimer(); // Start the logout timer when component mounts
    const mousemoveListener = () => handleActivity(); // Define mousemove listener
    const keydownListener = () => handleActivity(); // Define keydown listener
    window.addEventListener('mousemove', mousemoveListener); // Add mousemove listener
    window.addEventListener('keydown', keydownListener); // Add keydown listener
    return () => {
      window.removeEventListener('mousemove', mousemoveListener); // Clean up mousemove event listener
      window.removeEventListener('keydown', keydownListener); // Clean up keydown event listener
      clearTimeout(newTimer); // Clear the timer on unmount
    };
  }, [handleActivity, resetLogoutTimer]); // Include handleActivity and resetLogoutTimer in the dependency array

  // Redirect to login if user is not signed in
  if (!currentUser) {
    navigate('/login'); // Navigate to login page if user is not logged in
    return null; // Return null to prevent rendering the dashboard content
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ backgroundColor: '#15B4C2', color: '#fff', width: '250px', padding: '20px', position: 'fixed', left: 0, top: 0, height: '100vh', overflowY: 'auto' }}>
        <Link to="/dashboard" style={linkStyle}>
          <h2 style={{ borderBottom: '2px solid #fff', paddingBottom: '10px' }}>Dashboard</h2>
        </Link>
        
        {/* Links */}
        <Link to="/dashboard/appointments" style={linkStyle}>
          View Appointments Table
        </Link>
        <br />
        <Link to="/dashboard/add-doctors-departments" style={linkStyle}>
          Add Doctors & Departments
        </Link>
        <br />
        {/* Advertisement Link */}
        <Link to="/dashboard/add-advertisement" style={linkStyle}>
        Advertisement
        </Link>
        <br />
        {/* Logout Button */}
        <button style={logoutButtonStyle} onClick={handleLogout}>Logout</button>
      </div>
      
      {/* Main content */}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f0f0f0', paddingLeft: '270px' }}>
        {location.pathname === '/dashboard' && (
          <>
            <DashMain/>
          </>
        )}

        <Routes>
          <Route path="/" element={<Outlet />} />
          <Route path="appointments" element={<AppointmentsTable />} />
          <Route path="add-doctors-departments" element={<AddDoctorsDepartments />} />
          <Route path="add-advertisement" element={<Advertisement />} />
        </Routes>
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
  marginTop: '20px',
  display: 'block',
};

const logoutButtonStyle = {
  marginTop: '20px',
  backgroundColor: '#fff',
  color: '#15B4C2',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  borderRadius: '5px', // Add border radius for rounded corners
};

export default Dashboard;
