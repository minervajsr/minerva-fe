import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./PostJobPage.module.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Select from "react-select";
import skillOptions from "../constants/skillOptions.js";
import { AiOutlineDelete } from "react-icons/ai";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import Autocomplete from "react-google-autocomplete";
import StringList from "../components/StringList";
import ScreeningQuestionTemplate from "../components/ScreeningQuestionTemplate";

import bigCheck from "../assets/bigcheck.svg";

const PostJobPage = ({ totalSteps = 6 }) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [jobBenefits, setJobBenefits] = useState([]);
  const [keyResponsibilities, setKeyResponsibilities] = useState([]);
  const [location, setLocation] = useState("");
  const [jobScreeningQuestions, setJobScreeningQuestions] = useState([
    {
      question: "",
      answer: "",
    },
  ]);
  useEffect(() => {
    console.log("jobScreeningQuestions", jobScreeningQuestions);
  }, [jobScreeningQuestions]);

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleStepChange = (newStep) => {
    if (newStep >= 1 && newStep <= totalSteps) {
      setStep(newStep);
    }
  };

  function formatAmount(amount) {
    if (amount >= 1000) {
      const roundedAmount = Math.round(amount / 1000);
      return `${roundedAmount}K`;
    } else {
      return `${amount}`;
    }
  }

  const { jobId } = useParams();

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobLocation: "",
    jobType: "",
    jobDeadline: "",
    jobDescription: "",
    jobCategory: "",
    jobVacancies: 0,
    jobSalary: {
      min: 0,
      max: 1000000,
    },
    jobSkills: [],
    jobBenefits: [],
    keyResponsibilities: [],
    jobScreeningQuestions: [],
    // Add more fields as needed
  });

  useEffect(() => {
    console.log("jobData", jobData);
  }, [jobData]);

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/job/${jobId}`
      );
      let loadedJobData = response.data.data;
      loadedJobData.jobSkills = loadedJobData.jobSkills.map((skill) => ({
        value: skill,
        label: skill,
      }));
      console.log("loadedJobData", loadedJobData);
      setJobData(loadedJobData);
      setJobBenefits(loadedJobData.jobBenefits);
      setKeyResponsibilities(loadedJobData.keyResponsibilities);
      setLocation(loadedJobData.jobLocation);
      setJobScreeningQuestions(loadedJobData.jobScreeningQuestions);
      console.log("Job details fetched successfully:", loadedJobData);
    } catch (error) {
      console.error("Error fetching job details:", error);
    }
  };

  const postJob = async () => {
    jobData.jobBenefits = jobBenefits; // Updated jobBenefits
    jobData.keyResponsibilities = keyResponsibilities; // Updated keyResponsibilities
    jobData.userId = user._id;
    jobData.companyId = user.companyId;
    jobData.jobLocation = location;
    jobData.jobScreeningQuestions = jobScreeningQuestions;
    jobData.jobSkills = jobData.jobSkills.map((skill) => skill.value);
    console.log("jobData", jobData);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/${
          jobId ? "update-job" : "post-job"
        }`,
        jobData
      );
      console.log("Job Operation successfull:", response.data);
      nextStep();
      // Redirect or show success message
    } catch (error) {
      console.error("Error posting job:", error);
      // Show error message to the user
    }
  };

  const categoryList = [
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

  const renderFormForStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <label htmlFor='jobTitle'>Job Title</label>
                <input
                  type='text'
                  id='jobTitle'
                  placeholder='Enter Job Title'
                  value={jobData.jobTitle}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobTitle: e.target.value })
                  }
                />
              </div>
              <div className={styles.formColumn}>
                <label htmlFor='jobLocation'>Location</label>
                <Autocomplete
                  apiKey={"AIzaSyACFWIzVIxyQqRXnJWGZE9cYHJzWZTXicI"}
                  placeholder='Anywhere'
                  types={["(cities)"]}
                  onChange={(e) => {
                    // console.log(e.target.value);
                    setLocation(e.target.value);
                  }}
                  value={location}
                  onPlaceSelected={(place) => {
                    console.log(place);
                    setLocation(place.formatted_address);
                  }}
                />
                {/* <input
                  type='text'
                  id='jobLocation'
                  placeholder='Enter Job Location'
                  value={jobData.jobLocation}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobLocation: e.target.value })
                  }
                /> */}
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <label htmlFor='jobType'>Job Type</label>
                <select
                  id='jobType'
                  value={jobData.jobType}
                  onChange={(e) => {
                    setJobData({ ...jobData, jobType: e.target.value });
                  }}>
                  <option disabled value=''>
                    Select a job type
                  </option>
                  <option value='FULL_TIME'>Full Time</option>
                  <option value='PART_TIME'>Part Time</option>
                  <option value='FREELANCE'>Freelance</option>
                  <option value='INTERNSHIP'>Internship</option>
                </select>
              </div>
              <div className={styles.formColumn}>
                <label htmlFor='jobDeadline'>Job Application Date</label>
                <input
                  type='date'
                  id='jobDeadline'
                  value={jobData.jobDeadline}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobDeadline: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.formColumn}>
              <label htmlFor='jobDescription'>Job Description</label>
              <textarea
                className={styles.textArea}
                id='jobDescription'
                placeholder='Enter Job Description'
                value={jobData.jobDescription}
                onChange={(e) =>
                  setJobData({ ...jobData, jobDescription: e.target.value })
                }
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <label htmlFor='jobCategory'>Job Category</label>
                <select
                  id='jobCategory'
                  value={jobData.jobCategory}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobCategory: e.target.value })
                  }>
                  <option disabled value=''>
                    Select a Category
                  </option>
                  {categoryList.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formColumn}>
                <label htmlFor='jobVacancies'>Job Vacancies</label>
                <input
                  type='number'
                  id='jobVacancies'
                  placeholder='Enter Number of Vacancies'
                  value={jobData.jobVacancies}
                  onChange={(e) =>
                    setJobData({ ...jobData, jobVacancies: e.target.value })
                  }
                />
              </div>
            </div>

            <div className={styles.formColumn}>
              <label htmlFor='salaryRange'>Salary Range</label>
              <Slider
                min={0}
                max={200000}
                value={[jobData.jobSalary.min, jobData.jobSalary.max]}
                onChange={(value) => {
                  setJobData({
                    ...jobData,
                    jobSalary: { min: value[0], max: value[1] },
                  });
                }}
                range
              />
              <div className={styles.sliderLabel}>
                ₹{formatAmount(jobData.jobSalary.min)} - ₹
                {formatAmount(jobData.jobSalary.max)}
              </div>
            </div>

            <div className={styles.formColumn}>
              <label htmlFor='requiredSkills'>Required Skills</label>
              <Select
                isMulti
                options={skillOptions}
                value={jobData.jobSkills}
                onChange={(selectedOptions) => {
                  console.log(selectedOptions);
                  setJobData({ ...jobData, jobSkills: selectedOptions });
                }}
                placeholder='Select skills...'
                closeMenuOnSelect={false}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <label htmlFor='jobCategory'>Job Benefits</label>
                {step === 3 && (
                  <StringList
                    key='step3StringList' // Add a key prop here
                    arrayValue={jobBenefits}
                    updateArrayList={setJobBenefits}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <div className={styles.formColumn}>
                <label htmlFor='jobCategory'>Key Responsibilities</label>
                {step === 4 && (
                  <StringList
                    key='step4StringList' // Add a key prop here
                    arrayValue={keyResponsibilities}
                    updateArrayList={setKeyResponsibilities}
                  />
                )}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <ScreeningQuestionTemplate
            jobScreeningQuestions={jobScreeningQuestions}
            setJobScreeningQuestions={setJobScreeningQuestions}
          />
        );
      case 6:
        return (
          <div className={styles.jobResults}>
            <img src={bigCheck} alt='' />
            <h2>Job {jobId ? "Updated" : "Created"} Successfully</h2>
            <p>
              Your job has been {jobId ? "updated" : "created"} successfully.
              You can view your job in your dashboard.
            </p>
            <button
              className={styles.viewButton}
              onClick={() => navigate("/company/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.postPageContainer}>
      <h1>Create a job post</h1>
      <div className={styles.jobPostContainer}>
        <div className={styles.progressHeader} style={{ width: "50vw" }}>
          {/* STEP 1 */}
          <div className={styles.activeStep}>1</div>
          <div
            style={{
              width: "10%",
              height: "6px",
              backgroundColor: "#EFF0F6",
              borderRadius: "40px",
            }}>
            <div
              className={
                step === 1
                  ? styles.progressBarHalf
                  : step > 1
                  ? styles.progressBarComplete
                  : ""
              }></div>
          </div>

          {/* STEP 2 */}
          <div className={step >= 2 ? styles.activeStep : styles.step}>2</div>
          <div
            style={{
              width: "10%",
              height: "6px",
              backgroundColor: "#EFF0F6",
              borderRadius: "40px",
            }}>
            <div
              className={
                step === 2
                  ? styles.progressBarHalf
                  : step > 2
                  ? styles.progressBarComplete
                  : ""
              }></div>
          </div>

          {/* STEP 3 */}
          <div className={step >= 3 ? styles.activeStep : styles.step}>3</div>
          <div
            style={{
              width: "10%",
              height: "6px",
              backgroundColor: "#EFF0F6",
              borderRadius: "40px",
            }}>
            <div
              className={
                step === 3
                  ? styles.progressBarHalf
                  : step > 3
                  ? styles.progressBarComplete
                  : ""
              }></div>
          </div>

          {/* STEP 4 */}
          <div className={step >= 4 ? styles.activeStep : styles.step}>4</div>

          <div
            style={{
              width: "10%",
              height: "6px",
              backgroundColor: "#EFF0F6",
              borderRadius: "40px",
            }}>
            <div
              className={
                step === 4
                  ? styles.progressBarHalf
                  : step > 4
                  ? styles.progressBarComplete
                  : ""
              }></div>
          </div>
          <div className={step >= 5 ? styles.activeStep : styles.step}>5</div>
        </div>
        <div className={styles.jobPostFormContainer}>
          <div className={styles.formContainer}>{renderFormForStep()}</div>
        </div>
        {step <= 5 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              width: "100%",
              padding: "20px",
            }}>
            <div className={styles.btnContainer}>
              <button onClick={prevStep} className={styles.btnOutline}>
                Previous
              </button>
            </div>
            <div className={styles.btnContainer}>
              {step === 5 ? (
                <>
                  {jobId ? (
                    <button className={styles.btn} onClick={() => postJob()}>
                      Update Job
                    </button>
                  ) : (
                    <button className={styles.btn} onClick={() => postJob()}>
                      Post Job
                    </button>
                  )}
                </>
              ) : (
                <button onClick={nextStep}>Next</button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostJobPage;
