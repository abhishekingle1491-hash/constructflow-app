// src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/RegisterForm';
import { Link } from 'react-router-dom';
import '../components/FormStyles.css';

const RegisterPage = () => {
  return (
    <div className="page-container">
      <RegisterForm />
       <p className="form-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default RegisterPage;