// ContactPage.js

import React from "react";
import LandingNavbar from "../components/LandingPage/LandingNavbar";
import styles from "./ContactPage.module.css";
import { MdOutlineCheck } from "react-icons/md";

const ContactPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#f5f5f5",
        height: "100vh",
      }}>
      <LandingNavbar />
      <div
        style={{
          marginTop: "20px",
          height: "75vh",
          display: "flex",
        }}
        className={styles["contact-form"]}>
        <div className={styles.leftContainer}>
          <h3>Your success starts here</h3>

          <div className={styles.pointsContainer}>
            <div className={styles.point}>
              <MdOutlineCheck size={18} />
              <span>Over 40 categories</span>
            </div>
            <div className={styles.point}>
              <MdOutlineCheck size={18} />

              <span>Boost your profile at just ₹11</span>
            </div>
            <div className={styles.point}>
              <MdOutlineCheck size={28} />

              <span>Get personal mentor and grow your professional career</span>
            </div>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <h1>Contact Us</h1>
          <form>
            <div>
              <label>Name</label>
              <input type='text' placeholder='Enter your name' />
            </div>

            <div>
              <label>Email</label>
              <input type='email' placeholder='Enter your email' />
            </div>

            <div>
              <label>Phone</label>
              <input type='text' placeholder='Enter your phone number' />
            </div>

            <div>
              <label>Message</label>
              <textarea placeholder='Enter your message'></textarea>
            </div>

            <input type='submit' value='Submit' />
          </form>{" "}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
