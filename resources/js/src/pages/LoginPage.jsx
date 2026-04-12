// src/pages/LoginPage.jsx
import React, { useEffect } from 'react'; // 1. Import useEffect
import { Link, useNavigate } from 'react-router-dom'; // 2. Import useNavigate
import { useAuth } from '../contexts/AuthContext'; // 3. Import useAuth
import LoginForm from '../components/LoginForm';
import '../components/FormStyles.css';

const LoginPage = () => {
  const { user } = useAuth(); // 4. Get the 'user' state from context
  const navigate = useNavigate(); // 5. Get the navigate function

  // 6. Add this whole 'useEffect' block
  useEffect(() => {
    // If the user exists (meaning login was successful), redirect
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]); // This effect runs whenever 'user' changes

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