// src/components/SearchBar.js
import React from 'react';

const SearchBar = () => (
  <div className="search-bar">
    <input type="text" placeholder="Search..." className="search-input" />
    <button className="search-button">🔍</button>
  </div>
);

export default SearchBar;
