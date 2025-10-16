// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './FormStyles.css';

const LoginForm = () => {
  const { login, errors } = useAuth(); // [cite: 177]
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login({ email, password }); // [cite: 179]
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign In</h2>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {/* Laravel's default failed login message is keyed to 'email' */}
        {errors.email && <span className="error-text">{errors.email[0]}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button">Login</button>
    </form>
  );
};

export default LoginForm;