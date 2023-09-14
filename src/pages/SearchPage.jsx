import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import axios from "axios";
import styles from "./SearchPage.module.css";
import SearchBar from "../components/SearchBar";
import SearchCard from "../components/SearchCard";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
import skillOptions from "../constants/skillOptions.js";
import no_data from "../assets/no_data.svg";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const query = searchParams.get("query");
  const location = searchParams.get("location");

  const [searchResults, setSearchResults] = useState([]);

  const [fullTime, setFullTime] = useState(false);
  const [partTime, setPartTime] = useState(false);
  const [freelance, setFreelance] = useState(false);
  const [internship, setInternship] = useState(false);

  // Handler function to toggle the state of each checkbox
  const handleCheckboxChange = (e) => {
    const { id, checked } = e.target;

    // Use a switch statement or if statements to update the corresponding state
    switch (id) {
      case "fulltime":
        setFullTime(checked);
        break;
      case "parttime":
        setPartTime(checked);
        break;
      case "freelance":
        setFreelance(checked);
        break;
      case "internship":
        setInternship(checked);
        break;
      default:
        break;
    }
  };
  const handleSkillChange = (selectedOptions) => {
    setSelectedSkills(selectedOptions);
  };

  const handleDropdownClick = (event) => {
    event.stopPropagation(); // Prevent click propagation to the document
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [minSalary, setMinSalary] = useState(0);
  const [maxSalary, setMaxSalary] = useState(100000);

  const handleMinChange = (value) => {
    setMinSalary(value);
  };

  const handleMaxChange = (value) => {
    setMaxSalary(value);
  };

  const [salaryRange, setSalaryRange] = useState([0, 100000]);

  const handleSalaryRangeChange = (newValue) => {
    setSalaryRange(newValue);
  };

  function formatAmount(amount) {
    if (amount >= 1000) {
      const roundedAmount = Math.round(amount / 1000);
      return `${roundedAmount}K`;
    } else {
      return `${amount}`;
    }
  }

  const { response, loading, error } = useAxios({
    method: "get",
    url: `/api/v1/search?keyword=${query}&${location}=CA`,
  });

  useEffect(() => {
    setSearchResults(response);
  }, [loading]);

  // console.log(response, loading, error);

  const getSearchResults = async (url) => {
    try {
      const response = await axios.get(url);
      console.log("Search results", response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(
      "Job Filters",
      fullTime,
      partTime,
      freelance,
      internship,
      selectedSkills,
      minSalary,
      maxSalary
    );

    let baseUrl = `/api/v1/search?keyword=${query}&location=${
      location || "Anywhere"
    }`;

    if (fullTime) {
      baseUrl += "&jobType=FULL_TIME";
    }
    if (partTime) {
      baseUrl += "&jobType=PART_TIME";
    }
    if (freelance) {
      baseUrl += "&jobType=FREELANCE";
    }
    if (internship) {
      baseUrl += "&jobType=INTERNSHIP";
    }

    if (selectedSkills.length > 0) {
      baseUrl +=
        "&skills=" + selectedSkills.map((skill) => skill.value).join(",");
    }

    if (minSalary > 0 || maxSalary < 100000) {
      baseUrl += `&salaryRange=${minSalary},${maxSalary}`;
    }

    console.log(baseUrl);

    getSearchResults(baseUrl);
  }, [
    fullTime,
    partTime,
    freelance,
    internship,
    selectedSkills,
    minSalary,
    maxSalary,
    query,
    location,
  ]);

  return (
    <div>
      <div className={styles.searchContainer}>
        <div className={styles.filterContainer}>
          <div className={styles.filterCard}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}>
              <h3 className={styles.filterTitle}>Filters</h3>
              {/* <div className={styles.clearAll}>Clear All</div> */}
            </div>
            <div className={styles.inputContainer}>
              <h4>Date Post</h4>
              <select>
                <option value='company1'>Anytime</option>
                <option value='company2'>One Week Ago</option>
                <option value='company3'>One Month Ago</option>
              </select>
            </div>

            <div className={styles.inputContainer}>
              <h4>Job Type</h4>
              <div className={styles.new}>
                <form>
                  <div className={styles["form-group"]}>
                    <input
                      type='checkbox'
                      id='fulltime'
                      checked={fullTime}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor='fulltime'>Full Time</label>
                  </div>
                  <div className={styles["form-group"]}>
                    <input
                      type='checkbox'
                      id='parttime'
                      checked={partTime}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor='parttime'>Part Time</label>
                  </div>
                </form>
              </div>
              <div className={styles.new}>
                <form>
                  <div className={styles["form-group"]}>
                    <input
                      type='checkbox'
                      id='freelance'
                      checked={freelance}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor='freelance'>Freelance</label>
                  </div>
                  <div className={styles["form-group"]}>
                    <input
                      type='checkbox'
                      id='internship'
                      checked={internship}
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor='internship'>Internship</label>
                  </div>
                </form>
              </div>
            </div>
            <div className={styles.inputContainer}>
              <h4>Salary Range</h4>
              <div className={styles.rangeSlider}>
                <div className={styles.sliderContainer}>
                  <Slider
                    min={0}
                    max={200000}
                    value={[minSalary, maxSalary]}
                    onChange={(value) => {
                      handleMinChange(value[0]);
                      handleMaxChange(value[1]);
                    }}
                    range
                  />
                  <div className={styles.sliderLabel}>
                    ₹{formatAmount(minSalary)} - ₹{formatAmount(maxSalary)}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.inputContainer}></div>
            <div
              className={styles.inputContainer}
              onClick={handleDropdownClick}>
              <h4 style={{ marginTop: 14 }}>Skills</h4>
              <Select
                isMulti
                options={skillOptions}
                value={selectedSkills}
                onChange={handleSkillChange}
                placeholder='Select skills...'
                menuIsOpen={isDropdownOpen}
                closeMenuOnSelect={false}
              />
            </div>
          </div>
        </div>
        <div className={styles.resultsContainer}>
          <div className={styles.searchContent}>
            <SearchBar />
            <div className={styles.searchResults}>
              <h1 className={styles.searchHeading}>
                Search results for "{query}"
              </h1>

              {searchResults && searchResults.length > 0 ? (
                searchResults.map((job) => (
                  <SearchCard key={job.id} jobData={job} />
                ))
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}>
                    <img
                      style={{
                        width: "25vw",
                        height: "25vw",
                        objectFit: "cover",
                      }}
                      src={no_data}
                      alt='No data found'
                    />
                    <h4
                      style={{
                        color: "#384260",
                        fontSize: "1.5rem",
                      }}>
                      Oops! 🧐 No matches found. Try again?
                    </h4>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
