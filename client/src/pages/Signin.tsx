import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from '../services/api';
import { SigninCredentials } from '../types';

const Signin: React.FC = () => {
  const [credentials, setCredentials] = useState<SigninCredentials>({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await signin(credentials);
      if (response.success) {
        navigate('/dashboard'); // Redirect to dashboard after successful signin
      } else {
        setError(response.error || 'Signin failed');
      }
    } catch (err) {
      setError('Signin failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;