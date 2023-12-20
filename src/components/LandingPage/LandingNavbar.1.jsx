import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./LandingNavbar.module.css";
import logo from "../../assets/logo.svg";
import Modal from "react-modal";
import { MdOutlineCheck } from "react-icons/md";

export const LandingNavbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const menuRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
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
        contentLabel='OTP Verification Modal'
        ariaHideApp={false} // Disable aria-hidden error
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
        <div
          style={{
            backgroundColor: "transparent",
            position: "relative",
            zIndex: "2",
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "100%",
            borderEndStartRadius: "16px",
          }}>
          <div className={styles.modalContentLeft}>
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

                <span>
                  Get personal mentor and grow your professional career
                </span>
              </div>
            </div>
          </div>
          <div className={styles.modalContentRight}>
            <h2>Sign in to your account</h2>
            <p>Don’t have an account? Join Here</p>
            <div className={styles.formContainer}>
              <div>
                <label>Email</label>
                <input type='email' placeholder='Example@email.com' />
              </div>
              <div>
                <label>Password</label>
                <input type='password' placeholder='At least 8 characters' />
              </div>
              <div className={styles.forgotPassword}>
                <Link to='/forgot-password'>Forgot Password?</Link>
              </div>
              <button className={styles.submitBtn}>Sign Up</button>
              <p style={{ textAlign: "center" }}>OR</p>
              {/* Google Sign In */}
              <button className={styles.googleBtn}>
                <img
                  src='https://img.icons8.com/color/16/000000/google-logo.png'
                  alt='google'
                />
                Sign in with Google
              </button>
              LinkedIn Sign In
            </div>
          </div>
        </div>
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

            <button className={styles.signup} onClick={() => toggleModal()}>
              Sign Up
            </button>
            <button className={styles.login} onClick={() => toggleModal()}>
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

          <button className={styles.signup} onClick={() => toggleModal()}>
            Sign Up
          </button>
          <button className={styles.login} onClick={() => toggleModal()}>
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
