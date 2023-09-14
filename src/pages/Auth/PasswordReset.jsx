// ResetPassword.jsx
import React, { useState } from "react";
import styles from "./SignUp.module.css"; // Import the CSS module
import logo from "../../assets/logo.svg";
import axios from "axios";
import { BiErrorCircle } from "react-icons/bi";
import { useParams } from "react-router-dom";
const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [error, setError] = useState("");

  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid Token");
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/password-reset/${token}`,
        {
          password,
        }
      );
      console.log("response", response);
      setResetMessage("Password Reset Successfully");
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
          <h3>Reset Your Password?</h3>
          <p> Enter your new password below to reset your password.</p>
          <br />
          <div className={styles.authForm}>
            <form>
              <div
                className={styles.formGroup}
                style={{
                  marginBottom: "14px",
                }}>
                <label htmlFor='password' className={styles.label}>
                  New Password:
                </label>
                <input
                  type='password'
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.input}
                  placeholder='Enter your new password'
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='confirmPassword' className={styles.label}>
                  Confirm Password:
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.input}
                  placeholder='Confirm your new password'
                />
              </div>
              <button
                style={{
                  width: "100%",
                  marginTop: "10px",
                  marginBottom: "18px",
                }}
                onClick={handleResetPassword}>
                Reset Password
              </button>
            </form>
            <div className={styles.resetMessage}>
              {resetMessage && <p className={styles.success}>{resetMessage}</p>}
              {error && (
                <p className={styles.error}>
                  <BiErrorCircle size={24} /> {error}
                </p>
              )}
            </div>
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
  );
};

export default PasswordReset;
