import React from "react";
import styles from "./AboutSection.module.css";
import pic1 from "../../assets/pic_1.png";
import pic2 from "../../assets/pic_2.png";
import pic3 from "../../assets/pic_3.png";

const AboutSection = ({ order, title, description, link, background }) => {
  return (
    <div
      className={styles.AboutSection}
      style={{
        flexDirection: order ? "row-reverse" : "row",
        background: background ? background : "#fff",
      }}>
      <div className={styles.AboutSectionLeft}>
        <div className={styles.ImageHolder}>
          <img
            src={pic1}
            alt='about'
            style={{
              marginBottom: "-130px",
            }}
          />
        </div>
        <div className={styles.ImageHolder}>
          <img src={pic2} alt='about' />
        </div>
        <div
          className={styles.ImageHolder}
          style={{
            marginBottom: "-60px",
          }}>
          <img src={pic3} alt='about' />
        </div>
      </div>
      <div className={styles.AboutSectionRight}>
        <h1>Fostering Success in Work</h1>
        <p>
          Etiam condimentum duis molestie malesuada volutpat pellentesque sed.
          Ornare suspendisse ut ac neque lobortis sed tincidunt. Mi tempus quis
          massa tellus imperdiet aenean nulla id.
        </p>

        <h5>See how it helped others</h5>
      </div>
    </div>
  );
};

export default AboutSection;
