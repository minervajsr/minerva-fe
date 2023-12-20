import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

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
      minHeight: 150, // Adjust the minimum height as needed
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }),
    valueContainer: (base) => ({
      ...base,
    }),
  };

  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}>
      <h2>One Step Away</h2>
      <p>
        Your journey to your dream job is just one step away Complete your
        profile to make it a reality.
      </p>
      <br />
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
        <div className={styles.skillExample}>
          <h6>Example: </h6>
          <p>React </p>
          <p>Node </p>
          <p>Express </p>
          <p>Python </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            updateProfile(selectedSkills);
          }}>
          Done
        </button>
        <br />
      </div>
    </div>
  );
};

export default AddSkills;
