import React from "react";
import styles from "./RecommendedSection.module.css";
import SwitchComp from "../SwitchComp";
import CardSection from "./CardSection";

const RecommendedSection = () => {
  return (
    <>
      <div className={styles.recommendedSectionContainer}>
        <h1>Grab these exciting offers and apply now</h1>
        <SwitchComp />
      </div>
      <div className={styles.recommendedSectionCardsContainer}>
        <CardSection />
        <CardSection />
        <CardSection />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
        }}>
        <button className={styles.loadMoreBtn}>Browse all</button>
      </div>
      <br />
      <br />
    </>
  );
};

export default RecommendedSection;
