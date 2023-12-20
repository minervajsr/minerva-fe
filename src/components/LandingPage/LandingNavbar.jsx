import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LandingNavbar.module.css";
import logo from "../../assets/logo.svg";
import Modal from "react-modal";

import UserAuth from "./UserAuth";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(1); // 1 for login, 2 for signup
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const toggleModal = (val) => {
    setShowModal(!showModal);
    setAuthMode(val);
  };
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={menuRef}
      className={`${styles.LandingNavbar} ${
        isMenuOpen ? styles.openMenu : ""
      }`}>
      <Modal
        isOpen={showModal}
        onRequestClose={toggleModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.65)",
          },
          content: {
            width: "60vw",
            height: "90vh",
            margin: "auto",
            borderRadius: "16px",
            boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
            padding: "0px",
            border: "none",
          },
        }}>
        <UserAuth auth_mode={authMode} />
      </Modal>

      <div className={styles.logo}>
        <img src={logo} alt='logo' />
      </div>
      <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ""}`}>
        <ul>
          <li>
            <Link to='/find-job'>Find job</Link>
          </li>
          <li>
            <Link to='/featured'>Featured</Link>
          </li>
          <li>
            <Link to='/how-it-works'>About Us</Link>
          </li>
          <li>
            <Link to='/contact'>Contact</Link>
          </li>
        </ul>
        {isMobile && (
          <div className={`${styles.buttons} ${styles.mobileButtons}`}>
            <Link
              style={{
                color: "#0F6AF5",
              }}
              to='/company-login'>
              Post a job
            </Link>

            <button className={styles.signup} onClick={() => toggleModal(2)}>
              Sign Up
            </button>
            <button className={styles.login} onClick={() => toggleModal(1)}>
              Login
            </button>
          </div>
        )}
      </div>
      {!isMobile && (
        <div className={styles.buttons}>
          {/* <Link
            style={{
              borderRight: "2px solid rgba(56, 66, 96, 0.6)",
              padding: " 4px 20px",
              marginRight: "10px",
              color: "#0F6AF5",
            }}
            to='/company-login'>
            Post a job
          </Link> */}

          <button className={styles.signup} onClick={() => toggleModal(2)}>
            Sign Up
          </button>
          <button className={styles.login} onClick={() => toggleModal(1)}>
            Login
          </button>
        </div>
      )}
      {isMobile && (
        <div className={styles.hamburger} onClick={toggleMenu}>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
          <div className={styles.bar}></div>
        </div>
      )}
    </div>
  );
};

export default LandingNavbar;
