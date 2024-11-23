// src/components/Header.js
import React from 'react';

const Header = ({ email }) => (
  <header className="header">
    <h1 className="app-title">Al-Dhikr</h1>
    <div className="user-info">
      <span className="username">{email ? email : 'Guest'}</span> {/* Show email or 'Guest' */}
      <button className="theme-toggle">🌑</button>
    </div>
  </header>
);

export default Header;
