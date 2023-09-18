import React, { useState } from "react";
import logo from "../assets/logo.svg";
import styles from "./CompanySignupPage.module.css";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CompanySignupPage = () => {
  const [step, setStep] = useState(1);

  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    companyWebsite: "",
    companyAddress: "",
    companyDescription: "",
    companyCategory: "",
  });

  const companyCategories = [
    "IT",
    "FINANCE",
    "MARKETING",
    "SALES",
    "HR",
    "DESIGN",
    "OTHERS",
    "ANALYTICS",
    "ENGINEERING",
  ];

  const signUpNow = async (event) => {
    event.preventDefault();
    console.log("signUp Now");
    const url = `${import.meta.env.VITE_API_URL}/api/v1/add-company`;
    await axios
      .post(url, formData)
      .then(function (response) {
        toast.success("🎉 Email sent! Check your inbox.");

        setTimeout(() => {
          navigate("/company-login");
        }, 1000);
      })
      .catch(function (error) {
        toast.error("Something went wrong");
        console.log(error);
      });
  };

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  return (
    <div>
      <ToastContainer
        className='customToast'
        position='top-center'
        hideProgressBar
        autoClose={2000}
        closeButton={false}
      />
      <div className={styles.authNavbar}>
        {" "}
        <img
          src={logo}
          alt='logo'
          style={{
            width: "150px",
          }}
        />
      </div>
      <div className={styles.authContainer}>
        <div className={styles.authContainerLeft}>
          <h3>Register Now! To Unlock Top Talent 💎</h3>
          <p>
            Your Perfect Team Awaits. Join Us to Discover Exceptional
            Candidates!
          </p>
          <div className={styles.progressHeader}>
            <div className={styles.activeStep}>1</div>
            <div
              style={{
                width: "14%",
                height: "6px",
                backgroundColor: "#EFF0F6",
                borderRadius: "40px",
              }}>
              <div
                className={
                  step === 1
                    ? styles.progressBarHalf
                    : styles.progressBarComplete
                }></div>
            </div>
            <div className={step === 2 ? styles.activeStep : styles.step}>
              2
            </div>
          </div>
          {step === 1 && (
            <div className={styles.authForm}>
              {/* Step 1 Form */}
              <form>
                <div className={styles.formGroup}>
                  <div className={styles.formColumn}>
                    <label htmlFor='name'>Name</label>
                    <input
                      type='text'
                      id='name'
                      placeholder='Your Name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formColumn}>
                    <label htmlFor='companyEmail'>Email</label>
                    <input
                      type='email'
                      id='companyEmail'
                      placeholder='Your Email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='password'>Password</label>
                      <input
                        type='password'
                        id='password'
                        placeholder='Min 8 characters'
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='confirmPassword'>Confirm Password</label>
                      <input
                        type='password'
                        id='confirmPassword'
                        placeholder='Min 8 characters'
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <br />
                <div className={styles.btnContainer}>
                  <button onClick={nextStep}>Next</button>
                </div>
              </form>
              <div className={styles.signinBanner}>
                Already have an account?
                <span onClick={() => navigate("/company-login")}>Log In</span>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className={styles.authForm}>
              {/* Step 2 Form */}
              <form>
                <div className={styles.formGroup}>
                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyName'>Company Name</label>
                      <input
                        type='text'
                        id='companyName'
                        placeholder='Your Company Name'
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyEmail'>Company Email</label>
                      <input
                        type='email'
                        id='companyEmail'
                        placeholder='Company Official Email'
                        value={formData.companyEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyEmail: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyPhone'>Company Phone</label>
                      <input
                        type='text'
                        id='companyPhone'
                        placeholder='Company official phone number'
                        value={formData.companyPhone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyPhone: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyCategory'>Company Category</label>
                      <select
                        id='companyCategory'
                        value={formData.companyCategory}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyCategory: e.target.value,
                          })
                        }>
                        <option value=''>Select a category</option>
                        {companyCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyWebsite'>Company Website</label>
                      <input
                        type='text'
                        id='companyWebsite'
                        placeholder='Official Website'
                        value={formData.companyWebsite}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyWebsite: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className={styles.formColumn}>
                      <label htmlFor='companyAddress'>Company Address</label>
                      <input
                        type='text'
                        id='companyAddress'
                        placeholder='Company Address'
                        value={formData.companyAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className={styles.btnContainer}>
                    <button className={styles.btnOutline} onClick={prevStep}>
                      Back
                    </button>
                    <button onClick={signUpNow}>Register</button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* Signin banner */}
        </div>
      </div>
    </div>
  );
};

export default CompanySignupPage;
