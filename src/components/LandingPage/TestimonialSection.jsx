import React from "react";
import styles from "./TestimonialSection.module.css";
import dummy from "../../assets/dummy.webp";
import logdum from "../../assets/logdum.png";

const TestimonialSection = () => {
  return (
    <div className={styles.testimonialsSection}>
      <div className={styles.leftColumn}>
        <div className={styles.testimonialTitle}>- TESTIMONIAL</div>
        <div className={styles.subTitle}>Hear what our clients say</div>
        <div className={styles.subText}>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
          officia deserunt mollit anim.
        </div>
        <br />
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.logo}>
              <img src={logdum} alt='Company Logo' />
            </div>
            <div className={styles.cardText}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className={styles.avatar}>
              <img src={dummy} alt='User Avatar' />
              <div>
                <div className={styles.name}>John Doe</div>
                <div className={styles.designation}>CEO, Company Name</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.logo}>
              <img src={logdum} alt='Company Logo' />
            </div>
            <div className={styles.cardText}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className={styles.avatar}>
              <img src={dummy} alt='User Avatar' />
              <div>
                <div className={styles.name}>John Doe</div>
                <div className={styles.designation}>CEO, Company Name</div>
              </div>
            </div>
          </div>
        </div>
        <br />
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.logo}>
              <img src={logdum} alt='Company Logo' />
            </div>
            <div className={styles.cardText}>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div className={styles.avatar}>
              <img src={dummy} alt='User Avatar' />
              <div>
                <div className={styles.name}>John Doe</div>
                <div className={styles.designation}>CEO, Company Name</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
