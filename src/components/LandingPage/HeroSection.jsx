import React from "react";
import hero from "../../assets/hero.svg";
import star from "../../assets/star.svg";
import avatars from "../../assets/avatars.svg";
import styles from "./HeroSection.module.css";
import { FaChevronRight } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import { ImArrowUpRight2 } from "react-icons/im";

import brand1 from "./assets/brand1.svg";
// import brand2 from "./assets/brand2.svg";
// import brand3 from "./assets/brand3.svg";
// import brand4 from "./assets/brand4.svg";
// import brand5 from "./assets/brand5.svg";
// import brand6 from "./assets/brand6.svg";

const HeroSection = () => {
  return (
    <div>
      <div className={styles.heroContainer}>
        <div className={styles.heroContainerLeft}>
          <div className={styles.heroTag}>
            <img src={star} alt='star' className={styles.star} />
            Get Hired & Elevate Your Career
            <img src={star} alt='star' className={styles.star} />
          </div>
          <h1>
            Find Your <span>Dream job</span> <br />& Grow Your Professional
            Carrier
          </h1>
          <p>
            Get the job you want by researching employers, using the right
            keywords to filter job search results and Improving your networking
            skills
          </p>
          <div className={styles.heroBtnContainer}>
            <button className={styles.heroBtnP}>Get Started</button>
            <button className={styles.heroBtnS}>Know More</button>
          </div>
        </div>
        <div className={styles.heroContainerRight}>
          <img src={hero} alt='hero' className={styles.heroImage} />
        </div>
      </div>
      <div className={styles.heroBottomContainer}>
        <div className={styles.heroBottomContainerLeft}>
          <div className={styles.avatarBox}>
            <div className={styles.avatarGrp}>
              <img src={avatars} alt='' />
              <div className={styles.raitingBox}>
                <div className={styles.ratingIcon}>
                  <div className={styles.icon}>
                    <IoIosStar size={24} />
                  </div>

                  <div className={styles.rating}>
                    <h4>4.5 / 5/0</h4>
                    <p>Alimni Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.heroBar}>
          <div className={styles.heroBarText}>
            <p className={styles.avatarText}>
              Many alumni have secured their first job after completing their
              studies
            </p>
            <h4 className={styles.avatarLink}>
              Read what are they saying
              <span>
                <FaChevronRight
                  style={{
                    marginBottom: "-2px",
                  }}
                />
              </span>
            </h4>
          </div>

          <div className={styles.heroBarRight}>
            <div className={styles.statsBox}>
              <div className={styles.statIcon}>
                <div>
                  <ImArrowUpRight2 />
                </div>
              </div>
              <h1>240+</h1>
              <p>Available Jobs</p>
            </div>

            <div className={styles.statsBox}>
              <div className={styles.statIcon}>
                <div>
                  <ImArrowUpRight2 />
                </div>
              </div>
              <h1>240+</h1>
              <p>Available Jobs</p>
            </div>

            <div className={styles.statsBox}>
              <div className={styles.statIcon}>
                <div>
                  <ImArrowUpRight2 />
                </div>
              </div>
              <h1>240+</h1>
              <p>Available Jobs</p>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.brandRibbon}>
        {/* Brand 1 */}
        <div className={styles.brand}>
          <img src={brand1} alt='Brand 1' />
        </div>

        {/* Brand 2 */}
        <div className={styles.brand}>
          <img src={brand1} alt='Brand 2' />
        </div>

        {/* Brand 3 */}
        <div className={styles.brand}>
          <img src={brand1} alt='Brand 3' />
        </div>

        {/* Brand 4 */}
        <div className={styles.brand}>
          <img src={brand1} alt='Brand 4' />
        </div>

        {/* Brand 5 */}
        <div className={styles.brand}>
          <img src={brand1} alt='Brand 5' />
        </div>

        {/* Brand 6 */}
        <div className={styles.brand}>
          <img src={brand1} alt='Brand 6' />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
