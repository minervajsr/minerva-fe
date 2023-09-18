import React from "react";
import hero from "../../assets/hero.svg";
import styles from "./HeroSection.module.css";
import SearchBar from "./HeroSearchBar";

const HeroSection = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContainerLeft}>
        <h1>
          Find your <span>Dream job</span> now it’s easy
        </h1>
        <p>
          Get the job you want by researching employers, using the right
          keywords to filter job search results and Improving your networking
          skills
        </p>
        <div className={styles.searchBarContainer}>
          <SearchBar />
        </div>
      </div>
      <div className={styles.heroContainerRight}>
        <img src={hero} alt='hero' className={styles.heroImage} />
      </div>
    </div>
  );
};

export default HeroSection;
