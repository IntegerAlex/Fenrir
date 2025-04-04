import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [passKey, setPassKey] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passKey })
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem('auth_token', data.token);
        navigate('/dashboard');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('Connection error');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={passKey}
          onChange={(e) => setPassKey(e.target.value)}
          placeholder="Enter Pass Key"
          required
        />
        <div className="error">{errorMessage}</div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;

