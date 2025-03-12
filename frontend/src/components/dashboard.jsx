import React from "react";
import './dashboard.css';

const DashboardPage = ({ username, onLogout }) => {
  return (
    <div className="dashboard-container">
      <h1>Welcome, {username}!</h1>
      <button className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
