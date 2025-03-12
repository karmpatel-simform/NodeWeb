import React from 'react';
import './home.css';

const HomePage = ({ onNavigateToLogin }) => {
  return (
    <div className="home-container">
      <h1>Welcome to the App!</h1>
      <p>This is a simple app with login and dashboard functionality.</p>
      <button className="home-btn" onClick={onNavigateToLogin}>
        Go to Login
      </button>
    </div>
  );
};

export default HomePage;
