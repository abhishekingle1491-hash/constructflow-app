// src/components/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './FormStyles.css'; // We'll create this file for basic styling

const RegisterForm = () => {
  const { register, errors } = useAuth(); // [cite: 167]

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [organizationName, setOrganizationName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation, // Matches Laravel's 'confirmed' rule
      organization_name: organizationName,
    }); // [cite: 162]
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Create Your Account</h2>

      <div className="form-group">
        <label htmlFor="organizationName">Organization Name</label>
        <input
          id="organizationName"
          type="text"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.target.value)}
          required
        />
        {errors.organization_name && <span className="error-text">{errors.organization_name[0]}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {errors.name && <span className="error-text">{errors.name[0]}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
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
        {errors.password && <span className="error-text">{errors.password[0]}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="passwordConfirmation">Confirm Password</label>
        <input
          id="passwordConfirmation"
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-button">Register</button>
    </form>
  );
};

export default RegisterForm;