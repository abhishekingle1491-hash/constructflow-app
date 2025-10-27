// src/pages/Dashboard.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx'; // or .jsx

const Dashboard = () => {
  // Get the user from the auth context
  const { user } = useAuth();

  return (
    <div>
      <h1>Welcome to ConstructFlow, {user ? user.name : 'User'}!</h1>
      <p>This is your dashboard. More features coming soon.</p>
    </div>
  );
};

export default Dashboard;