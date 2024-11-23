import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Import custom CSS for styling

const surahNames = [
  "Al-Fatihah", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah",
  "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus",
  "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr",
  "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha",
  "Al-Anbiya", "Al-Hajj", "Al-Mu'minun", "An-Nur", "Al-Furqan",
  "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum",
  "Luqman", "As-Sajda", "Al-Ahzab", "Saba", "Fatir",
  "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir",
  "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiya",
  "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf",
  "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman",
  "Al-Waqi'a", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahana",
  "As-Saff", "Al-Jumu'a", "Al-Munafiqun", "At-Taghabun", "At-Talaq",
  "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqa", "Al-Ma'arij",
  "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyama",
  "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa",
  "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj",
  "At-Tariq", "Al-A'la", "Al-Ghashiya", "Al-Fajr", "Al-Balad",
  "Ash-Shams", "Al-Lail", "Ad-Duhaa", "Ash-Sharh", "At-Tin",
  "Al-Alaq", "Al-Qadr", "Al-Bayyina", "Az-Zalzala", "Al-Adiyat",
  "Al-Qari'a", "At-Takathur", "Al-Asr", "Al-Humaza", "Al-Fil",
  "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr",
  "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"
];

const MainContent = () => {
  const [userData, setUserData] = useState(null);
  const [newGoal, setNewGoal] = useState({ ayahs_per_day: '' });
  const [ayahsRead, setAyahsRead] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      window.location.href = '/login';
      return;
    }

    fetch(`http://localhost:5000/main?user_id=${userId}`)
      .then((response) => response.json())
      .then(setUserData)
      .catch(console.error);
  }, []);

  const handleGoalSubmit = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    fetch('http://localhost:5000/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newGoal, user_id: userId }),
    })
      .then(() => fetch(`http://localhost:5000/main?user_id=${userId}`))
      .then((response) => response.json())
      .then(setUserData)
      .catch(console.error);
  };

  const handleProgressUpdate = (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');
    fetch('http://localhost:5000/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ayahs_read: parseInt(ayahsRead, 10), user_id: userId }),
    })
      .then(() =>
        setUserData((prev) => ({
          ...prev,
          ayahs_read: (prev.ayahs_read || 0) + parseInt(ayahsRead, 10),
        }))
      )
      .catch(console.error);
  };

  return (
    <div className="main-content">
      {userData ? (
        <div>
          <div className="progress-section">
            <h2>Progress</h2>
            <div className="progress-bar">
              <p>Ayahs Per Day: {userData.ayahs_per_day || 'N/A'}</p>
              <p>Ayahs Read: {userData.ayahs_read || 0}</p>
            </div>
            <form onSubmit={handleGoalSubmit}>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Ayahs per day"
                  value={newGoal.ayahs_per_day}
                  onChange={(e) => setNewGoal({ ...newGoal, ayahs_per_day: e.target.value })}
                />
                <button type="submit">Set Goals</button>
              </div>
            </form>
            <form onSubmit={handleProgressUpdate}>
              <div className="form-group">
                <input
                  type="number"
                  placeholder="Ayahs read"
                  value={ayahsRead}
                  onChange={(e) => setAyahsRead(e.target.value)}
                />
                <button type="submit">Update Progress</button>
              </div>
            </form>
          </div>

          <div className="surah-cards">
            {surahNames.map((name, index) => (
              <Link key={index} to={`/surah/${index + 1}`} className="surah-card">
                Surah {name}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MainContent;
