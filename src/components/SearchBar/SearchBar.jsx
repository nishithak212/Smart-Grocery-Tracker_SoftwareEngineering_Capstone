import React from "react";
import { useState } from "react";
import searchIcon from "../../assets/icons/magnifying-glass-solid.svg";
import clearIcon from "../../assets/icons/xmark-solid.svg";
import "./SearchBar.scss";

const SearchBar = ({ onSearch }) => {
  const [input, setInput] = useState("");

  const handleSearchClick = () => {
    onSearch(input);
  };

  const handleClear = () => {
    setInput("");
    onSearch("");
  };

  return (
    <div className="search-container">
      <input
        className="search-container__input"
        type="text"
        placeholder="Search grocery items..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {input && (
        <button className="clear-icon" onClick={handleClear} type="button">
          <img className="clear-icon__img" src={clearIcon} alt="Clear" />
        </button>
      )}
      <button className="search-icon" onClick={handleSearchClick}>
        <img className="search-icon__img" src={searchIcon} alt="Search" />
      </button>
    </div>
  );
};

export default SearchBar;
