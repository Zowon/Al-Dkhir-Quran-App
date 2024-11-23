import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainContent from './components/MainContent';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail'; // Import the SurahDetail component
import './App.css';

const App = () => {
  const [email, setEmail] = useState(localStorage.getItem('user_email')); // Store email from localStorage

  const isLoggedIn = !!localStorage.getItem('user_id'); // Check if user is logged in

  useEffect(() => {
    // Update the email in the state if it changes (e.g., after login)
    setEmail(localStorage.getItem('user_email'));
  }, []);

  return (
    <Router>
      <div className="app">
        <Header email={email} /> {/* Pass email to Header */}
        <SearchBar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Route to main page only if user is logged in */}
          <Route path="/main" element={isLoggedIn ? <MainContent /> : <Navigate to="/login" />} />
          {/* Route for SurahList page */}
          <Route path="/surah" element={<SurahList />} />
          {/* Route for SurahDetail page */}
          <Route path="/surah/:surahNumber" element={<SurahDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
