import React, { useState, useEffect } from 'react';

const ProgressSection = () => {
  const [data, setData] = useState({});
  const [newGoal, setNewGoal] = useState({ ayahs_per_day: ''});
  const [ayahsRead, setAyahsRead] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      window.location.href = '/login';
      return;
    }
  
    fetch(`http://localhost:5000/goals?user_id=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      })
      .catch((error) => console.error('Error fetching goals and progress:', error));
  }, []);
  
  const handleGoalSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newGoal),
    })
      .then(() => {
        // Fetch updated goals after setting
        return fetch('http://localhost:5000/goals');
      })
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error setting or updating goals:', error));
  };

  const handleProgressUpdate = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    fetch('http://localhost:5000/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ayahs_read: parseInt(ayahsRead, 10), user_id: userId }),
    })
      .then(() => {
        // Fetch updated data after progress update
        return fetch(`http://localhost:5000/goals?user_id=${userId}`);
      })
      .then((response) => response.json())
      .then((data) => {
        setUserData(data);
      })
      .catch(console.error);
  };
  

  return (
    <div className="progress-section">
      <div className="progress-bar">
        <h2>Progress</h2>
        <p>You have read {data.ayahs_read || 0} ayahs today</p>
        <p>
          Goals: {data.ayahs_per_day || 'N/A'} ayahs per day, {data.minutes_per_day || 'N/A'} minutes
        </p>
      </div>
      <form onSubmit={handleGoalSubmit}>
        <input
          type="number"
          placeholder="Ayahs per day"
          value={newGoal.ayahs_per_day}
          onChange={(e) => setNewGoal({ ...newGoal, ayahs_per_day: e.target.value })}
        />
        <button type="submit">Set or Update Goals</button>
      </form>
      <form onSubmit={handleProgressUpdate}>
        <input
          type="number"
          placeholder="Ayahs read"
          value={ayahsRead}
          onChange={(e) => setAyahsRead(e.target.value)}
        />
        <button type="submit">Update Progress</button>
      </form>
    </div>
  );
};

export default ProgressSection;
