import React, { useState, useEffect, Suspense } from "react";
import { Routes, Route, Outlet, useNavigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import { LinkedInCallback } from "react-linkedin-login-oauth2";
import Spinner from "./components/Spinner";
import "./App.css";
const HomePage = React.lazy(() => import("./pages/HomePage"));
const UserDashboard = React.lazy(() => import("./pages/UserDashboard"));
const SearchPage = React.lazy(() => import("./pages/SearchPage"));
const JobDetailPage = React.lazy(() => import("./pages/JobDetailPage"));
const CompanySignupPage = React.lazy(() => import("./pages/CompanySignupPage"));
const CompanyLoginPage = React.lazy(() =>
  import("./pages/CompanyLoginPage.jsx")
);
const LogIn = React.lazy(() => import("./pages/Auth/LogIn"));
const SignUp = React.lazy(() => import("./pages/Auth/SignUp"));
const AddSkills = React.lazy(() => import("./pages/Auth/AddSkills"));
const NavBar = React.lazy(() => import("./components/NavBar"));
const CompanyDashboard = React.lazy(() => import("./pages/CompanyDashboard"));
const PostJobPage = React.lazy(() => import("./pages/PostJobPage"));
const MessagePage = React.lazy(() => import("./pages/MessagePage"));
const JobControlPage = React.lazy(() => import("./pages/JobControlPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const ForgotPassword = React.lazy(() => import("./pages/Auth/ForgotPassword"));
const PasswordReset = React.lazy(() => import("./pages/Auth/PasswordReset"));

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
    <Suspense fallback={<Spinner />}>
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
    </Suspense>
  );
}

export default App;
