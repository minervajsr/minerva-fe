import React from "react";
import { Link, useNavigate } from "react-router-dom"; // Import React Router's Link component
import styles from "./LandingNavbar.module.css";
import logo from "../../assets/logo.svg";

const LandingNavbar = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.LandingNavbar}>
      <div className={styles.logo}>
        <img src={logo} alt='logo' />
      </div>
      <div className={styles.menu}>
        <ul>
          <li>
            <Link to='/find-job'>Find job</Link>
          </li>
          <li>
            <Link to='/featured'>Featured</Link>
          </li>
          <li>
            <Link to='/how-it-works'>How it works</Link>
          </li>
          <li>
            <Link to='/contact'>Contact</Link>
          </li>
        </ul>
      </div>
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
    </div>
  );
};

export default LandingNavbar;
