import React, { useState } from "react";
import styles from "./HeroSearchBar.module.css";
import { FiSearch, FiMapPin } from "react-icons/fi";

const HeroSearchBar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  return (
    <div className={styles.SearchBarContainer}>
      <div className={styles.SearchBarInputContainer}>
        <FiSearch className={styles.SearchBarIcon} />
        <input
          type='text'
          placeholder={`${isMobile ? "Keyword" : "Job title or keyword"}`}
        />
      </div>

      <div className={styles.SearchBarInputContainer}>
        <FiMapPin className={styles.SearchBarIcon} />
        <input type='text' placeholder='Anywhere' />
      </div>

      <button className={styles.SearchButton} onClick={() => {}}>
        Search
      </button>
    </div>
  );
};

export default HeroSearchBar;
