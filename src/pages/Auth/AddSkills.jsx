import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import axios from "axios";

import styles from "./AddSkills.module.css";
import Select from "react-select";
import skillOptions from "../../constants/skillOptions.js";
const AddSkills = ({ formData }) => {
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  axios.defaults.withCredentials = true;

  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const createUser = async () => {
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
        userSkills: selectedSkills.map((skill) => skill.value),
      })
      .then(function (response) {
        console.log("res", response.data);
        setTimeout(() => {
          dispatch({ type: "LOGIN", payload: response.data.user });
          localStorage.setItem(
            "minervauser",
            JSON.stringify(response.data.user)
          );
          setSignUpSteps(3);
        }, 1200);
      })
      .catch(function (error) {
        console.log(error);
        toast.error("Hmm... 🤔 Signup didn't work. Retry?");
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
            createUser();
          }}>
          Done
        </button>
        <br />
      </div>
    </div>
  );
};

export default AddSkills;
