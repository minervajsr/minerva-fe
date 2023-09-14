// ForgotPassword.jsx
import React, { useState } from "react";
import styles from "./SignUp.module.css"; // Reuse styles or create new ones
import logo from "../../assets/logo.svg";
import axios from "axios";
import { BiErrorCircle } from "react-icons/bi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/forgot-password`,
        {
          email,
        }
      );
      console.log("response", response);
      setResetMessage(response.data.message);
      setError("");
    } catch (error) {
      console.log(error);
      setError(error.response.data.message);
      setResetMessage("");
    }
  };

  return (
    <div>
      <div className={styles.authNavbar}>
        <img
          src={logo}
          alt='logo'
          style={{
            width: "150px",
          }}
        />
      </div>
      <div className={styles.authContainerForgetPassword}>
        <div>
          <h3>Forgot Your Password?</h3>
          <p>Enter your email address to reset your password.</p>
          <br />
          <div className={styles.authForm}>
            <form autoComplete='none'>
              <div className={styles.formGroup}>
                {/* <label htmlFor='email'>Email</label> */}
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  id='email'
                  autoComplete='none'
                  placeholder='Example@email.com'
                />
                <input
                  type='text'
                  autoComplete='on'
                  value=''
                  style={{
                    display: "none",
                    opacity: 0,
                    position: "absolute",
                    left: "-100000px",
                  }}
                  readOnly={true}
                />
                <button onClick={handleResetPassword}>Reset Password</button>
              </div>
            </form>
            <br />
            <div className={styles.resetMessage}>
              {resetMessage && <p className={styles.success}>{resetMessage}</p>}
              {error && (
                <p className={styles.error}>
                  <BiErrorCircle size={24} /> {error}
                </p>
              )}
            </div>
            <div className={styles.contactInfo}>
              <p>
                If you encounter any issues or need further assistance, please
                contact our support team at{" "}
                <a href='mailto:support@example.com'>hr@minerva.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
