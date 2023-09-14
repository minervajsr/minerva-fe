import React from "react";
import styles from "./FooterSection.module.css";
import logo from "../../assets/logo.svg";

import {
  BsLinkedin,
  BsInstagram,
  BsWhatsapp,
  BsTwitter,
  BsFillSendFill,
} from "react-icons/bs";

import { FiMapPin, FiMail, FiPhone } from "react-icons/fi";

const FooterSection = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footerColumn}>
        <div className={styles.footerRow}>
          <img src={logo} alt='Logo' className={styles.logo} />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            vehicula euismod ex, non malesuada orci.
          </p>
        </div>
        <div className={styles.footerRow}>
          <h3>Get in Touch</h3>
          <ul className={styles.contactList}>
            <li>
              <FiMapPin /> 123 Main St, City
            </li>
            <li>
              <FiMail /> example@example.com
            </li>
            <li>
              <FiPhone /> (123) 456-7890
            </li>
          </ul>
        </div>
        <div className={styles.footerRow}>
          <div className={styles.socialIcons}>
            <div className={styles.social}>
              <BsLinkedin />
            </div>
            <div className={styles.social}>
              <BsInstagram />
            </div>
            <div className={styles.social}>
              <BsWhatsapp />
            </div>
            <div className={styles.social}>
              <BsTwitter />
            </div>
          </div>
          <p>
            Follow us on social media for updates and news. Lorem ipsum dolor
            sit amet, consectetur adipiscing elit.
          </p>
        </div>
        <div className={styles.footerRow}>
          <h3>Send us your query</h3>
          <input
            type='text'
            placeholder='Explain your query'
            className={styles.queryInput}
          />{" "}
          <button className={styles.sendButton}>
            Send <BsFillSendFill />
          </button>
        </div>
      </div>
      <div className={styles.footerBanner}>
        © All Rights Reserved by Minerva - Trusted Connections
      </div>
    </div>
  );
};

export default FooterSection;
