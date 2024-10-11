import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Routes, Route, Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider '; // Corrected import path
import AppointmentsTable from './AppointmentsTable';
import AddDoctorsDepartments from './AddDoctorsDepartments';
import DashMain from './DashMain';
import Advertisement from './Advertisement';
import { FaHome, FaCalendarAlt, FaPlus, FaBullhorn, FaSignOutAlt } from 'react-icons/fa'; // Import icons

const Dashboard = () => {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [logoutTimer, setLogoutTimer] = useState(null);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('currentUser');
    clearTimeout(logoutTimer);
    navigate('/login');
  }, [logoutTimer, navigate]);

  const resetLogoutTimer = useCallback(() => {
    clearTimeout(logoutTimer);
    const newTimer = setTimeout(() => {
      handleLogout();
    }, 30 * 60 * 1000); // 30 minutes
    return newTimer;
  }, [logoutTimer, handleLogout]);

  const handleActivity = useCallback(() => {
    const newTimer = resetLogoutTimer();
    setLogoutTimer(newTimer);
  }, [resetLogoutTimer]);

  useEffect(() => {
    if (currentUser) {
      const newTimer = resetLogoutTimer();
      const mousemoveListener = () => handleActivity();
      const keydownListener = () => handleActivity();
      window.addEventListener('mousemove', mousemoveListener);
      window.addEventListener('keydown', keydownListener);
      return () => {
        window.removeEventListener('mousemove', mousemoveListener);
        window.removeEventListener('keydown', keydownListener);
        clearTimeout(newTimer);
      };
    }
  }, [currentUser, handleActivity, resetLogoutTimer]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#f0f0f0', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: '#15B4C2', color: '#fff', width: '250px', padding: '20px', position: 'fixed', left: 0, top: 0, height: '100vh', overflowY: 'auto' }}>
        <div>
          <h2 style={{ borderBottom: '2px solid #fff', paddingBottom: '10px', textAlign: 'center' }}>Dashboard</h2>

          {/* Links with Icons */}
          <Link to="/dashboard" style={linkStyle}>
            <FaHome style={iconStyle} /> Home
          </Link>
          <Link to="/dashboard/appointments" style={linkStyle}>
            <FaCalendarAlt style={iconStyle} /> View Appointments
          </Link>
          <Link to="/dashboard/add-doctors-departments" style={linkStyle}>
            <FaPlus style={iconStyle} /> Add Doctors & Departments
          </Link>
          <Link to="/dashboard/add-advertisement" style={linkStyle}>
            <FaBullhorn style={iconStyle} /> Advertisement
          </Link>
        </div>

        {/* Logout Button at the Bottom */}
        <button style={logoutButtonStyle} onClick={handleLogout}>
          <FaSignOutAlt style={{ marginRight: '8px' }} /> Logout
        </button>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px', paddingLeft: '270px' }}>
        {location.pathname === '/dashboard' && <DashMain />}

        <Routes>
          <Route path="/" element={<Outlet />} />
          <Route path="appointments" element={<AppointmentsTable />} />
          <Route path="add-doctors-departments" element={<AddDoctorsDepartments />} />
          <Route path="add-advertisement" element={<Advertisement />} />
        </Routes>
      </div>
    </div>
  );
};

const linkStyle = {
  textDecoration: 'none',
  color: '#fff',
  marginTop: '20px',
  display: 'flex',
  alignItems: 'center',
};

const iconStyle = {
  marginRight: '10px',
};

const logoutButtonStyle = {
  marginTop: '20px',
  backgroundColor: '#fff',
  color: '#15B4C2',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  borderRadius: '5px',
  display: 'flex',
  alignItems: 'center',
};

export default Dashboard;
