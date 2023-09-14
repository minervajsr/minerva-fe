import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";
import logo from "../../assets/logo.svg";
import authbanner from "../../assets/auth-image.svg";
import styles from "./AddSkills.module.css";
import Select from "react-select";
import skillOptions from "../../constants/skillOptions.js";
const AddSkills = () => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  axios.defaults.withCredentials = true;

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const updateProfile = async (skills) => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/user/update`;
    const response = await axios
      .post(
        url,
        {
          userSkills: skills.map((skills) => skills.value),
          id: user._id,
        },
        {
          withCredentials: true, // Include withCredentials configuration for this request
        }
      )
      .then(function (response) {
        console.log(response.data);
        dispatch({ type: "LOGIN", payload: response.data.user });
        localStorage.setItem("minervauser", JSON.stringify(response.data.user));
        navigate("/dashboard");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: 100, // Adjust the minimum height as needed
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }),
    valueContainer: (base) => ({
      ...base,
    }),
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
      <div className={styles.authContainer}>
        <div className={styles.authContainerLeft}>
          <h3>One Step Away</h3>
          <p>
            Your journey to your dream job is just one step away Complete your
            profile to make it a reality.
          </p>
          <div className={styles.authForm}>
            <Select
              isMulti
              options={skillOptions}
              value={selectedSkills}
              onChange={handleSkillChange}
              placeholder='Select Minimum 5 Skills'
              styles={customStyles}
            />
            <br />
            <button
              onClick={(e) => {
                e.preventDefault();
                updateProfile(selectedSkills);
              }}>
              Done
            </button>

            <br />
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

export default AddSkills;
