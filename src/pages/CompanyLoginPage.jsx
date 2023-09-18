import React, { useState } from "react";
import logo from "../assets/logo.svg";
import styles from "./CompanySignupPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import authbanner from "../assets/auth-image.svg";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
const CompanyLoginPage = () => {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginNow = async () => {
    console.log("Login Now");
    const url = `${import.meta.env.VITE_API_URL}/api/v1/company-user-login`;
    await axios
      .post(url, {
        email: formData.email,
        password: formData.password,
      })
      .then(function (response) {
        console.log("res", response.data);
        toast.success("🎉 Authentication Successful");

        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: response.data.user });
          localStorage.setItem(
            "minervauser",
            JSON.stringify(response.data.user)
          );
          navigate("/company/dashboard");
        }, 1000);
      })
      .catch(function (error) {
        toast.error("Something went wrong");
        console.log(error);
      });
  };

  return (
    <div>
      <div className={styles.authNavbar}>
        {" "}
        <ToastContainer
          className='customToast'
          position='top-center'
          hideProgressBar
          autoClose={2000}
          closeButton={false}
        />
        <img
          src={logo}
          alt='logo'
          style={{
            width: "150px",
          }}
        />
      </div>
      <div className={styles.authContainer}>
        <div
          className={styles.authContainerLeft}
          style={{
            width: "40%",
            padding: "0 3rem",
            height: "68vh",
          }}>
          <h3>Welcome Back 👋</h3>
          <p>
            Your Perfect Team Awaits. Log in to Discover Exceptional Candidates!
          </p>

          <div className={styles.authForm}>
            {/* Step 1 Form */}
            <form>
              <div className={styles.formGroup}>
                <div className={styles.formColumn}>
                  <label htmlFor='companyEmail'>Email</label>
                  <input
                    type='email'
                    id='companyEmail'
                    placeholder='Your Email'
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className={styles.formColumn}>
                  <label htmlFor='password'>Password</label>
                  <input
                    type='password'
                    id='password'
                    placeholder='Min 8 characters'
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              </div>
              <br />
            </form>
            <div className={styles.btnContainer}>
              <button
                onClick={() => {
                  loginNow();
                }}>
                Log In
              </button>
            </div>
            <div
              className={styles.signinBanner}
              style={{
                marginTop: "1rem",
              }}>
              Don't have an account?
              <span onClick={() => navigate("/company-signup")}>
                Sign Up Now
              </span>
            </div>
          </div>
        </div>
        {/* <div className={styles.authContainerRight}  style={{
            width: "50%",
          }}>
          <img src={authbanner} alt='logo' width={"70%"} />
        </div> */}
      </div>
    </div>
  );
};

export default CompanyLoginPage;
