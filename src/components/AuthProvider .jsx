// AuthProvider.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Create an authentication context
export const AuthContext = createContext();

// Authentication context provider
export const AuthProvider = ({ children = null }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const auth = getAuth();

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // If user is authenticated, store the user data in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
      } else {
        // If user is not authenticated, remove user data from local storage
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
