import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider ';

function LoginWrapper({ children }) {
  const { currentUser } = useContext(AuthContext);

  if (currentUser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default LoginWrapper;
