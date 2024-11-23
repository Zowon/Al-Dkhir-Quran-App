import React, { useState } from 'react';

function SurahList() {
  const [surahNumber, setSurahNumber] = useState('');
  const [ayahNumber, setAyahNumber] = useState('');
  const [resultData, setResultData] = useState([]);
  const [translationData, setTranslationData] = useState([]); // State for translations
  const [error, setError] = useState('');

  const handleFetchData = () => {
    let url = '';
    if (surahNumber && ayahNumber) {
      // Search for a specific Ayah in a Surah
      url = `http://localhost:5000/search_ayah/${surahNumber}/${ayahNumber}`;
    } else if (surahNumber) {
      // Search for all Ayahs in a Surah
      url = `http://localhost:5000/surah/${surahNumber}`;
    } else {
      setError('Please enter a Surah number.');
      return;
    }

    // Fetch the original Ayah data
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setResultData([]);
          setTranslationData([]);
        } else {
          setResultData(Array.isArray(data) ? data : [data]); // Ensure data is an array
          setError('');

          if (surahNumber && ayahNumber) {
            // If both Surah and Ayah are provided, fetch the translation for that specific Ayah
            fetchTranslationAyah(surahNumber, ayahNumber);
          } else if (surahNumber) {
            // If only Surah is provided, fetch the translation for the entire Surah
            fetchTranslation(surahNumber);
          }
        }
      })
      .catch(() => setError('Error fetching data.'));
  };

  const fetchTranslation = (surahNumber) => {
    fetch(`http://localhost:5000/translation/${surahNumber}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setTranslationData([]);
        } else {
          setTranslationData(data);
        }
      })
      .catch(() => setError('Error fetching translation.'));
  };

  const fetchTranslationAyah = (surahNumber, ayahNumber) => {
    fetch(`http://localhost:5000/ayah_translation/${surahNumber}/${ayahNumber}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setTranslationData([]);
        } else {
          setTranslationData([data]); // Only one translation data since it's a specific Ayah
        }
      })
      .catch(() => setError('Error fetching translation for Ayah.'));
  };

  return (
    <div>
      <h2>Search Surah or Ayah</h2>
      <div>
        <input
          type="number"
          placeholder="Enter Surah number"
          value={surahNumber}
          onChange={(e) => setSurahNumber(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Ayah number (optional)"
          value={ayahNumber}
          onChange={(e) => setAyahNumber(e.target.value)}
        />
        <button onClick={handleFetchData}>Fetch</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {resultData.length > 0 && (
        <div>
          {resultData.map((item, index) => (
            <p key={index}>
              <strong>Ayah {item.Ayah_Number}: </strong>
              {item.Ayah_Text}
            </p>
          ))}
        </div>
      )}
      {translationData.length > 0 && (
        <div>
          <h3>Translation</h3>
          {translationData.map((item, index) => (
            <p key={index}>
              <strong>Ayah {item.Ayah_Number}: </strong>
              {item.Ayah_Translation}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default SurahList;
