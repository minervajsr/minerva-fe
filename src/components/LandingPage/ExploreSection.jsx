import React from "react";
import styles from "./ExploreSection.module.css";
import cat1 from "./assets/cat1.svg";

const ExploreSection = () => {
  return (
    <div className={styles.exploreContainer}>
      <div className={styles.exploreContainerLeft}>
        <h1>
          Explore By <span>Category</span>{" "}
        </h1>
        <p>
          With our cutting-edge technology and vast network of reputable
          employers, we provide a seamless and efficient platform for
          professionals to discover their dream positions.
        </p>
        <br />
        <button className={styles.btn}>Explore More</button>
      </div>

      <div className={styles.exploreContainerRight}>
        <div className={styles.exploreContainerRightRow}>
          <div className={styles.exploreContainerRightRowCol}>
            <div className={styles.exploreContainerRightRowColIconBox}>
              <img src={cat1} alt='' />
            </div>

            <div className={styles.exploreContainerRightRowColBox}>
              <h3>Development</h3>
              <p>10+ Jobs</p>
            </div>
          </div>

          <div className={styles.exploreContainerRightRowCol}>
            <div className={styles.exploreContainerRightRowColIconBox}>
              <img src={cat1} alt='' />
            </div>

            <div className={styles.exploreContainerRightRowColBox}>
              <h3>Design</h3>
              <p>1,000+ Jobs</p>
            </div>
          </div>
        </div>
        <br />
        <div className={styles.exploreContainerRightRow}>
          <div className={styles.exploreContainerRightRowCol}>
            <div className={styles.exploreContainerRightRowColIconBox}>
              <img src={cat1} alt='' />
            </div>

            <div className={styles.exploreContainerRightRowColBox}>
              <h3>Sales</h3>
              <p>1,000+ Jobs</p>
            </div>
          </div>

          <div className={styles.exploreContainerRightRowCol}>
            <div className={styles.exploreContainerRightRowColIconBox}>
              <img src={cat1} alt='' />
            </div>

            <div className={styles.exploreContainerRightRowColBox}>
              <h3>Marketing</h3>
              <p>1,000+ Jobs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreSection;
