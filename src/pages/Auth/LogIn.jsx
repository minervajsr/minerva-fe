import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import authbanner from "../../assets/auth-image.svg";
import styles from "./SignUp.module.css";
import { FcGoogle } from "react-icons/fc";
import { BsLinkedin } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import { useGoogleLogin } from "@react-oauth/google";
import { useLinkedIn } from "react-linkedin-login-oauth2";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LogIn = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //Linkedin Login
  const getLinkedInAccessToken = async (code) => {
    console.log("code", code);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/linkedin`,
        {
          code,
        }
      );
      console.log("response", response);

      dispatch({ type: "LOGIN", payload: response.data.user });
      localStorage.setItem("minervauser", JSON.stringify(response.data.user));

      if (response.data.user.userSkills.length === 0) {
        console.log("No Skills");
        navigate("/skills");
      } else {
        if (user.userType === "COMPANY") {
          navigate("/company/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.log(error);
    }
    // responseGoogle(data.id_token);
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
        navigate("/skills");
      } else {
        navigate("/dashboard");
      }
    },
    flow: "auth-code",
  });

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
          const userData = {
            user: response.data.user,
            token: response.data.token,
          };
          console.log("userData", userData);
          localStorage.setItem("minervauser", JSON.stringify(userData));
          navigate("/dashboard");
        }, 1200);
      })
      .catch(function (error) {
        toast.error(error.response.data.message || "Authentication Failed");
        console.log(error);
      });
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
          <h3>Welcome Back 👋</h3>
          <p>
            Today is a new day. It's your day. You shape it. Sign up to start
            finding your dream job.
          </p>
          <div className={styles.authForm}>
            <form>
              <div className={styles.formGroup}>
                <label htmlFor='email'>Email</label>
                <input
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  type='email'
                  id='email'
                  placeholder='Example@email.com'
                />

                <label htmlFor='password'>Password</label>
                <input
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                  }}
                  type='password'
                  id='password'
                  placeholder='At least 8 characters'
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginBottom: "-8px",
                    marginTop: "-3px",
                  }}>
                  <Link to='/forgot-password'>Forgot Password?</Link>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    loginNow();
                  }}>
                  Log In
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
                  Sign in with Google
                </button>
                <button onClick={linkedInLogin}>
                  <BsLinkedin size={21} color='#0077B5' />
                  Sign in with Linkedin
                </button>
              </div>
            </div>
            <div className={styles.signinBanner}>
              Already have an account?
              <span onClick={() => navigate("/signup")}>Sign Up</span>
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

export default LogIn;
