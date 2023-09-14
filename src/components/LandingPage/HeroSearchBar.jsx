import React from "react";
import styles from "./HeroSearchBar.module.css";
import { FiSearch, FiMapPin } from "react-icons/fi";

const HeroSearchBar = () => {
  return (
    <div className={styles.SearchBarContainer}>
      <div className={styles.SearchBarInputContainer}>
        <FiSearch className={styles.SearchBarIcon} />
        <input type='text' placeholder='Job title or keyword' />
      </div>

      <div className={styles.SearchBarInputContainer}>
        <FiMapPin className={styles.SearchBarIcon} />
        <input type='text' placeholder='Bengaluru  |  India' />
      </div>

      <button className={styles.SearchButton} onClick={() => {}}>
        Search
      </button>
    </div>
  );
};

export default HeroSearchBar;
