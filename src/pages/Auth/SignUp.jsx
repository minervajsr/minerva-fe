import React, { useState, useRef } from "react";
import logo from "../../assets/logo.svg";
import authbanner from "../../assets/auth-image.svg";
import styles from "./SignUp.module.css";
import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios"; // Import axios for API calls
import { useGoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";
import Modal from "react-modal";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [showVerifyEmailModal, setShowVerifyEmailModal] = useState(false);
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);

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
        navigate("/skills");
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

  const toggleVerifyEmailModal = () => {
    setShowVerifyEmailModal(!showVerifyEmailModal);
  };

  // Create refs for OTP input fields
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const renderVerifyEmailModal = () => {
    if (showVerifyEmailModal) {
      return (
        <Modal
          isOpen={showVerifyEmailModal}
          onRequestClose={toggleVerifyEmailModal}
          contentLabel='OTP Verification Modal'
          ariaHideApp={false} // Disable aria-hidden error
          style={{
            overlay: {
              backgroundColor: "rgba(0, 0, 0, 0.65)",
            },
            content: {
              width: "400px",
              height: "fit-content",
              margin: "auto",
              borderRadius: "8px",
              padding: "24px",
              boxShadow: "0px 4px 24px rgba(0, 0, 0, 0.1)",
            },
          }}>
          <div className={styles.modal}>
            <h4>Verify Email</h4>
            <p>
              Please enter the OTP sent to your email for verification to
              complete the email verification process.
            </p>
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
            <div className={styles.buttonContainer}>
              <button onClick={verifyEmailOtp}>Verify OTP</button>
              <p onClick={toggleVerifyEmailModal} className={styles.closeModal}>
                Close
              </p>
            </div>
          </div>
        </Modal>
      );
    }
  };

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
    console.log("Verify Email");
    const url = `${import.meta.env.VITE_API_URL}/api/v1/email-verification`; // Adjust the API endpoint

    const response = await axios
      .post(url, {
        email: formData.email,
      })
      .then(function (response) {
        toast.success("🎉 Email sent! Check your inbox.");
        console.log("res", response);
        toggleVerifyEmailModal();
      })
      .catch(function (error) {
        console.log(error);
        toast.error(error.response.data.message);
      });
  };

  const signUpNow = async () => {
    console.log("Sign Up Now");
    const url = `${import.meta.env.VITE_API_URL}/api/v1/signup`; // Adjust the API endpoint

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      toast.error("Please fill all the fields");
      return;
    }

    const response = await axios
      .post(url, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })
      .then(function (response) {
        console.log("res", response.data);
        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: response.data.user });
          localStorage.setItem(
            "minervauser",
            JSON.stringify(response.data.user)
          );
          navigate("/skills");
        }, 1200);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Hmm... 🤔 Signup didn't work. Retry?");
      });
    console.log("res", response.data);
    // Handle success, redirect or show a success message
  };

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
        signUpNow();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });

    // Send a request to verify OTP (you can implement this)
    // Check if the OTP is valid and proceed accordingly

    // Close the OTP verification modal
    toggleVerifyEmailModal();
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
      {renderVerifyEmailModal()}

      <div className={styles.authNavbar}>
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
          <h3>Welcome To Minerva</h3>
          <p>Sign up now to start finding your dream job.</p>
          <div className={styles.authForm}>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor='name'>Name</label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  type='text'
                  id='name'
                  placeholder='Your full name'
                />

                <label htmlFor='email'>Email</label>
                <input
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type='email'
                  id='email'
                  placeholder='Example@email.com'
                />

                <label htmlFor='password'>Password</label>
                <input
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type='password'
                  id='password'
                  placeholder='At least 8 characters'
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // signUpNow();
                    verifyEmail();
                  }}>
                  Sign Up
                </button>
              </div>
            </form>
            <div
              style={{
                textAlign: "center",
                marginTop: "8px",
              }}>
              or
              <div className={styles.socialContainer}>
                <button onClick={() => googlelogin()}>
                  <FcGoogle size={26} />
                  Sign Up with Google
                </button>
                <button onClick={linkedInLogin}>
                  <BsLinkedin size={21} color='#0077B5' />
                  Sign Up with Linkedin
                </button>
              </div>
            </div>
            <div className={styles.signinBanner}>
              Already have an account?
              <span onClick={() => navigate("/login")}>Sign in</span>
            </div>
          </div>
        </div>
        <div className={styles.authContainerRight}>
          <img src={authbanner} alt='logo' width={"70%"} />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
