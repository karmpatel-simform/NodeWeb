import React, { useState } from "react";
import LoginPage from "./components/login";
import DashboardPage from "./components/dashboard";
import HomePage from "./components/home";

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');  // Track the current page
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = async (username, password) => {
    const response = await fetch('http://localhost:9000/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',  // Important to include cookies
    });
  
    if (response.ok) {
      console.log('Login successful');
      setCurrentPage('dashboard');  // Redirect to the dashboard
    } else {
      console.log('Login failed');
      // Handle the login failure (show an error message)
    }
  };
  

  const handleLogout = () => {
    setUsername("");
    setIsLoggedIn(false);
    setCurrentPage('home');  // Return to home page after logout
  };

  const navigateToLogin = () => {
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToLogin={navigateToLogin} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'dashboard':
        return <DashboardPage username={username} onLogout={handleLogout} />;
      default:
        return <HomePage onNavigateToLogin={navigateToLogin} />;
    }
  };

  return (
    <div>
      {renderPage()}
    </div>
  );
};

export default App;

