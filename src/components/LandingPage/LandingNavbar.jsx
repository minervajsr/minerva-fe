import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LandingNavbar.module.css";
import logo from "../../assets/logo.svg";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);

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
                color: "#0061FE",
              }}
              to='/company-login'>
              Post a job
            </Link>

            <button
              className={styles.signup}
              onClick={() => navigate("/signup")}>
              Sign Up
            </button>
            <button className={styles.login} onClick={() => navigate("/login")}>
              Login
            </button>
          </div>
        )}
      </div>
      {!isMobile && (
        <div className={styles.buttons}>
          <Link
            style={{
              borderRight: "2px solid rgba(56, 66, 96, 0.6)",
              padding: " 4px 20px",
              marginRight: "10px",
              color: "#0061FE",
            }}
            to='/company-login'>
            Post a job
          </Link>

          <button className={styles.signup} onClick={() => navigate("/signup")}>
            Sign Up
          </button>
          <button className={styles.login} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      )}
      <div className={styles.hamburger} onClick={toggleMenu}>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
        <div className={styles.bar}></div>
      </div>
    </div>
  );
};

export default LandingNavbar;
