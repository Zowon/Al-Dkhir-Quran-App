import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../App.css';

const SurahDetail = () => {
  const { surahNumber } = useParams(); // Get current Surah number from URL
  const [surahName, setSurahName] = useState('');
  const [ayahs, setAyahs] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [translationLang, setTranslationLang] = useState('en');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch Surah and Ayah data
    fetch(`http://localhost:5000/surah/${surahNumber}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setAyahs(data.Ayahs);
          setSurahName(data.Surah_Name || '');
        }
      })
      .catch(() => setError('Error fetching Ayahs.'));

    // Fetch Translations
    fetch(`http://localhost:5000/translation/${translationLang}/${surahNumber}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setTranslations(data);
        }
      })
      .catch(() => setError('Error fetching translations.'));
  }, [surahNumber, translationLang]);

  // Handle Language Change
  const handleLanguageChange = (e) => {
    setTranslationLang(e.target.value);
  };

  // Navigate to Previous Surah
  const goToPreviousSurah = () => {
    if (surahNumber > 1) {
      navigate(`/surah/${parseInt(surahNumber) - 1}`);
    }
  };

  // Navigate to Next Surah
  const goToNextSurah = () => {
    navigate(`/surah/${parseInt(surahNumber) + 1}`);
  };

  return (
    <div className="container">
      {/* Language Selector in Top-Right Corner */}
      <div className="language-select">
        <label htmlFor="language">Translation:</label>
        <select id="language" value={translationLang} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="ur">Urdu</option>
          <option value="fr">French</option>
        </select>
      </div>

      {/* Surah Header */}
      <div className="surah-header">
        <h1>سُورَة: {surahName}</h1>
        <p>Surah {surahNumber}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* Ayahs */}
      <div className="ayah-container">
        {ayahs.map((ayah, index) => (
          <div key={ayah.Ayah_Number} className="ayah-card">
            <p>
              <strong>Ayah {ayah.Ayah_Number}:</strong> {ayah.Ayah_Text}
            </p>
            <div className="translation">
              <p>
                <strong>Translation:</strong>{' '}
                {translations[index]?.Ayah_Translation || 'Loading translation...'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="button-group">
        <button disabled={surahNumber <= 1} onClick={goToPreviousSurah}>
          Previous Surah
        </button>
        <button onClick={goToNextSurah}>Next Surah</button>
      </div>
    </div>
  );
};

export default SurahDetail;
