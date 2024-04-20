import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from "./components/homePage";
import Dashboard from "./components/dashboard";
import LoginPage from './components/login';
import { AuthProvider } from './components/AuthProvider '; // Import AuthProvider

function App() {
  return (
    <AuthProvider> {/* Wrap the entire application with AuthProvider */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path='/login' element={<LoginPage/>}/>
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
