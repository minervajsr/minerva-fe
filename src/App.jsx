import { useState, useEffect } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

import HomePage from "./pages/HomePage";
import UserDashboard from "./pages/UserDashboard";
import SearchPage from "./pages/SearchPage";
import JobDetailPage from "./pages/JobDetailPage";
import CompanySignupPage from "./pages/CompanySignupPage";
import CompanyLoginPage from "./pages/CompanyLoginPage.jsx";

import "./App.css";
import LogIn from "./pages/Auth/LogIn";
import SignUp from "./pages/Auth/SignUp";
import AddSkills from "./pages/Auth/AddSkills";
import NavBar from "./components/NavBar";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJobPage from "./pages/PostJobPage";
import MessagePage from "./pages/MessagePage";
import JobControlPage from "./pages/JobControlPage";
import ProfilePage from "./pages/ProfilePage";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import PasswordReset from "./pages/Auth/PasswordReset";

function App() {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const routesWithoutAuth = [
    "/login",
    "/signup",
    "/linkedin",
    "/company-login",
    "/company-signup",
    "/skills",
    "/",
  ];

  useEffect(() => {
    console.log("User", user);
    console.log("Path", window.location.pathname);
    if (!user && !routesWithoutAuth.includes(window.location.pathname)) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route exact path='/linkedin' element={<LinkedInCallback />} />

        {/* AUTHENTICATION ROUTES */}
        <Route
          path='/login'
          element={
            <GoogleOAuthProvider clientId='340027487577-8qlcetamo41b34kiesqasu1a4mbajhob.apps.googleusercontent.com'>
              <LogIn />
            </GoogleOAuthProvider>
          }
        />
        <Route
          path='/signup'
          element={
            <>
              <GoogleOAuthProvider clientId='340027487577-8qlcetamo41b34kiesqasu1a4mbajhob.apps.googleusercontent.com'>
                <SignUp />{" "}
              </GoogleOAuthProvider>
            </>
          }
        />

        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/password-reset/:token' element={<PasswordReset />} />

        <Route path='/skills' element={<AddSkills />} />
        <Route path='/company-login' element={<CompanyLoginPage />} />
        <Route path='/company-signup' element={<CompanySignupPage />} />

        {/* APPLICATION ROUTES */}
        <Route
          element={
            <>
              <NavBar />
              <Outlet />
            </>
          }>
          <Route path='/profile' index element={<ProfilePage />} />
          <Route path='/dashboard' index element={<UserDashboard />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/job/:jobId' element={<JobDetailPage />} />
          <Route path='/company/dashboard' element={<CompanyDashboard />} />
          <Route path='/company/post-job/:jobId?' element={<PostJobPage />} />
          <Route path='/company/job/:jobId' element={<JobControlPage />} />
          <Route path='/message' element={<MessagePage />} />
        </Route>

        <Route path='*' element={<h1>Not Found</h1>} />
      </Routes>
    </>
  );
}

export default App;
