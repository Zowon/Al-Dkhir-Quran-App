import React, { useState } from 'react';
import '../Login.css'; // New CSS file for cleaner organization

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (email, password) => {
    fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          localStorage.setItem('user_id', data.user_id);
          window.location.href = `/main?user_id=${data.user_id}`;
        }
      })
      .catch((error) => {
        console.error('Login error:', error);
      });
  };

  return (
    <div className="login-page">
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue</p>
  
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(email, password);
          }}
          className="login-form"
        >
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="input-group">
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign up here</a>.
        </p>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
