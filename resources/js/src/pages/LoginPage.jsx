// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';
import '../components/FormStyles.css';

const LoginPage = () => {
  return (
    <div className="page-container">
      <LoginForm />
      <p className="form-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default LoginPage;