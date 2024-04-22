import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineCheck } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios"; // Import axios for API calls
import { useGoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import styles from "./UserAuth.module.css";
import AddSkills from "../../pages/Auth/AddSkills";

const UserAuth = ({ auth_mode }) => {
  const [authMode, setAuthMode] = useState(auth_mode); // 1 for login, 2 for signup
  const [signUpSteps, setSignUpSteps] = useState(1); // 1 for details, 2 for otp, 3 for skills and interests
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);

  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendMinutes, setResendMinutes] = useState(2);
  const [resendSeconds, setResendSeconds] = useState(0);

  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  // Resend timer
  useEffect(() => {
    let resendCountdown = null;
    if (resendDisabled) {
      resendCountdown = setInterval(() => {
        if (resendSeconds > 0) {
          setResendSeconds(resendSeconds - 1);
        }
        if (resendSeconds === 0) {
          if (resendMinutes === 0) {
            clearInterval(resendCountdown);
            setResendDisabled(false);
          } else {
            setResendMinutes(resendMinutes - 1);
            setResendSeconds(59);
          }
        }
      }, 1000);
    }
    return () => clearInterval(resendCountdown);
  }, [resendDisabled, resendMinutes, resendSeconds]);

  const handleResendClick = () => {
    setResendDisabled(true);
    setResendMinutes(2);
    setResendSeconds(0);

    verifyEmail();
    // ... code to resend OTP ...
  };

  const { linkedInLogin } = useLinkedIn({
    clientId: "77y22iyhuynakm",
    redirectUri: `${window.location.origin}/linkedin`,
    redirectPath: "/linkedin",
    scope: ["openid", "profile", "email"],
    //
    onSuccess: (code) => {
      console.log("code", code);
      getLinkedInAccessToken(code);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const googlelogin = useGoogleLogin({
    onSuccess: async ({ code }) => {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/google`,
        {
          code,
        }
      );

      console.log(response);

      dispatch({ type: "LOGIN", payload: response.data.user });
      localStorage.setItem("minervauser", JSON.stringify(response.data.user));

      if (response.data.user.userSkills.length === 0) {
        console.log("No Skills");
        setSignUpSteps(3);
      } else {
        navigate("/dashboard");
      }
    },
    flow: "auth-code",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // useEffect(() => {
  //   console.log("formData", formData);
  // }, [formData]);

  // Create refs for OTP input fields
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleOtpInputChange = (e, index) => {
    // Step 3: Update OTP input values
    const newOtpInputs = [...otpInputs];
    newOtpInputs[index] = e.target.value;
    setOtpInputs(newOtpInputs);

    // Automatically move to the next input field if a digit is entered
    if (e.target.value.length === 1 && index < otpInputs.length - 1) {
      otpInputRefs[index + 1].current.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    // Move to the previous input field when Backspace is pressed on an empty field
    if (e.key === "Backspace" && index > 0 && !otpInputs[index]) {
      otpInputRefs[index - 1].current.focus();
    }
  };

  const verifyEmail = async () => {
    setSignUpSteps(2);
    console.log("Verify Email");
    const url = `${import.meta.env.VITE_API_URL}/api/v1/email-verification`;

    console.log("formData", formData);

    const response = await axios
      .post(url, {
        email: formData.email,
      })
      .then(function (response) {
        toast.success("🎉 Email sent! Check your inbox.");
        console.log("res", response);
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  // const signUpNow = async () => {
  //   console.log("Sign Up Now");
  //   const url = `${import.meta.env.VITE_API_URL}/api/v1/signup`; // Adjust the API endpoint

  //   if (
  //     formData.name === "" ||
  //     formData.email === "" ||
  //     formData.password === ""
  //   ) {
  //     toast.error("Please fill all the fields");
  //     return;
  //   }

  //   const response = await axios
  //     .post(url, {
  //       name: formData.name,
  //       email: formData.email,
  //       password: formData.password,
  //     })
  //     .then(function (response) {
  //       console.log("res", response.data);
  //       setTimeout(() => {
  //         dispatch({ type: "LOGIN", payload: response.data.user });
  //         localStorage.setItem(
  //           "minervauser",
  //           JSON.stringify(response.data.user)
  //         );
  //         setSignUpSteps(3);
  //       }, 1200);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       toast.error("Hmm... 🤔 Signup didn't work. Retry?");
  //     });
  //   // Handle success, redirect or show a success message
  // };

  const verifyEmailOtp = async () => {
    // Combine OTP input values into a single string
    const otpValue = otpInputs.join("");

    const response = await axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/v1/email-verification/verify`,
        {
          email: formData.email,
          otp: otpValue,
        }
      )
      .then((response) => {
        toast.success("🎉 Email verified!");
        setSignUpSteps(3);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const loginNow = async () => {
    console.log("Login Now");
    const url = `${import.meta.env.VITE_API_URL}/api/v1/login`;
    await axios
      .post(url, {
        email: formData.email,
        password: formData.password,
      })
      .then(function (response) {
        toast.success("Authentication Successful");
        console.log("res", response.data);

        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: response.data.user });
          localStorage.setItem(
            "minervauser",
            JSON.stringify(response.data.user)
          );

          navigate("/dashboard");
        }, 1200);
      })
      .catch(function (error) {
        toast.error(error.response.data.message || "Authentication Failed");
        console.log(error);
      });
  };

  return (
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
      <ToastContainer
        className='customToast'
        position='top-center'
        hideProgressBar
        autoClose={2000}
        closeButton={false}
      />
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

            <span>Get personal mentor and grow your professional career</span>
          </div>
        </div>
      </div>

      {/* SIGN IN FORM */}

      {authMode === 1 ? (
        <div className={styles.modalContentRight}>
          <h2>Sign in to your account</h2>
          <p>
            Don’t have an account?{" "}
            <span onClick={() => setAuthMode(2)}>Join Here</span>
          </p>
          <div className={styles.formContainer}>
            <div>
              <label>Email</label>
              <input
                type='email'
                placeholder='Example@email.com'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type='password'
                placeholder='At least 8 characters'
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>
            <div className={styles.forgotPassword}>
              <Link to='/forgot-password'>Forgot Password?</Link>
            </div>

            <button className={styles.submitBtn} onClick={() => loginNow()}>
              Sign In
            </button>
            <p
              style={{
                textAlign: "center",
                marginBottom: -6,
                marginTop: -6,
              }}>
              OR
            </p>
            <div className={styles.socialContainer}>
              {/* Google Sign In */}
              <button
                className={styles.googleBtn}
                onClick={() => googlelogin()}>
                <FcGoogle size={28} />
                Sign in with Google
              </button>

              {/* LinkedIn Sign In */}
              <button className={styles.linkedinBtn} onClick={linkedInLogin}>
                <FaLinkedin size={28} color='#0A66C2' />
                Sign in with LinkedIn
              </button>
            </div>
          </div>
        </div>
      ) : (
        // SIGN UP FORM
        <>
          {
            /* STEP 1 */
            signUpSteps === 1 && (
              <div className={styles.modalContentRight}>
                <h2
                  style={
                    {
                      // marginTop: "-10px",
                    }
                  }>
                  Sign up to get started
                </h2>
                <p>
                  Already have an account?{" "}
                  <span onClick={() => setAuthMode(1)}>Sign In</span>
                </p>
                <div
                  className={styles.formContainer}
                  style={{
                    marginTop: "30px",
                  }}>
                  <div>
                    <label>Name</label>
                    <input
                      type='name'
                      placeholder='Enter your name'
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Email</label>
                    <input
                      type='email'
                      placeholder='Enter your email'
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label>Password</label>
                    <input
                      type='password'
                      placeholder='At least 8 characters'
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                    />
                  </div>
                  <button
                    onClick={() => verifyEmail()}
                    className={styles.submitBtn}>
                    Next
                  </button>

                  <div className={styles.socialContainer}>
                    {/* Google Sign In */}
                    <button
                      className={styles.googleBtn}
                      onClick={() => googlelogin()}>
                      <FcGoogle size={28} />
                      Sign up with Google
                    </button>

                    {/* LinkedIn Sign In */}
                    <button
                      className={styles.linkedinBtn}
                      onClick={linkedInLogin}>
                      <FaLinkedin size={28} color='#0A66C2' />
                      Sign up with LinkedIn
                    </button>
                  </div>
                </div>
              </div>
            )
          }
          {signUpSteps === 2 && (
            <div className={styles.modalContentRight}>
              <h2>Verify your email </h2>
              <p>
                Enter the OTP sent to your email address{" "}
                <span
                  style={{
                    color: "#0F6AF5",
                    cursor: "pointer",
                  }}>
                  Resend OTP
                </span>
              </p>
              <br />
              <div className={styles.emailTag}>
                <span>
                  <MdEmail color='#364152' />
                  {formData.email}
                </span>{" "}
                <FaRegEdit
                  onClick={() => setSignUpSteps(1)}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </div>
              <div className={styles.OTPformContainer}>
                <div className={styles.otpInputs}>
                  {otpInputs.map((value, index) => (
                    <input
                      key={index}
                      type='number' // Set the input type to "number"
                      inputMode='numeric' // Add input mode for better compatibility
                      value={value}
                      onChange={(e) => handleOtpInputChange(e, index)}
                      maxLength='1'
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      ref={otpInputRefs[index]}
                      id={`otpInput-${index}`}
                    />
                  ))}
                </div>
                <div
                  style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "row-reverse",
                    justifyContent: "space-between",
                    marginLeft: "-6px",
                  }}>
                  <button
                    className={styles.resendbtn}
                    disabled={resendDisabled}
                    onClick={handleResendClick}>
                    {resendDisabled
                      ? `Resend OTP in ${resendMinutes}:${
                          resendSeconds < 10
                            ? `0${resendSeconds}`
                            : resendSeconds
                        }`
                      : "Resend OTP"}
                  </button>
                  <br />
                  <button
                    style={{
                      marginTop: "40px",
                    }}
                    className={styles.submitBtn}
                    onClick={verifyEmailOtp}>
                    Verify OTP
                  </button>
                </div>
              </div>
              <p className={styles.otpId}>The OTP is valid for 10 minutes.</p>{" "}
            </div>
          )}

          {signUpSteps === 3 && (
            <div className={styles.modalContentRight}>
              <AddSkills formData={formData} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserAuth;
