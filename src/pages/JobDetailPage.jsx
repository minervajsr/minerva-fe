import React, { useState } from "react";
import styles from "./JobDetailPage.module.css";
import useAxios from "../hooks/useAxios";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import ApplyModal from "../components/ApplyModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BsBookmarkCheck,
  BsChatLeftText,
  BsBookmarkCheckFill,
  BsArrowRight,
} from "react-icons/bs";
const jobType = (jobType) => {
  if (jobType === "FULL_TIME") {
    return "Full Time";
  } else if (jobType === "PART_TIME") {
    return "Part Time";
  } else if (jobType === "INTERNSHIP") {
    return "Internship";
  } else if (jobType === "FREELANCE") {
    return "Freelance";
  }
};
import { HiArrowNarrowRight } from "react-icons/hi";
const JobDetailPage = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { response, loading, error } = useAxios({
    method: "get",
    url: `api/v1/job/${jobId}`,
    headers: JSON.stringify({ accept: "*/*" }),
  });
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };

  const handleSubmitApplication = (applicationData) => {
    // Handle the submission of the application data here
    console.log("Application Data:", applicationData);
    applyForJob(applicationData);
    // Close the modal after submission
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const applyForJob = async (applicationData) => {
    const url = `${import.meta.env.VITE_API_URL}/api/v1/apply/${jobId}`;
    await axios
      .post(url, {
        applicationData,
      })
      .then(function (response) {
        console.log("res", response.data);
        setShowApplyModal(false);
        toast.success("🎉 Application Submitted!");
      })
      .catch(function (error) {
        console.log(error);
        setShowApplyModal(false);
        toast.error(error.response.data.message);
      });
  };

  function formatAmount(amount) {
    if (amount >= 1000) {
      const roundedAmount = Math.round(amount / 1000);
      return `${roundedAmount}K`;
    } else {
      return `${amount}`;
    }
  }

  function formatDate(inputDateString) {
    const inputDate = new Date(inputDateString);

    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }
  const jobData = response?.data;

  return (
    <div className={styles.jobDetailContainer}>
      <ToastContainer
        className='customToast'
        position='top-center'
        hideProgressBar
        autoClose={2000}
        closeButton={false}
      />

      <div className={styles.jobDetailLeft}>
        <h2>More Like This</h2>
        <div className={styles.jobSuggestionsContainer}>
          {response?.recommendedJobs &&
            response?.recommendedJobs.map((job) => (
              <div key={job._id}>
                <JobCard jobData={job} />
              </div>
            ))}
        </div>
      </div>
      <div className={styles.jobDetailRight}>
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
          }}>
          <div>
            <h2>{jobData.jobTitle}</h2>
            <h4>{jobData.jobCompany?.companyName}</h4>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "30%",
              alignItems: "center",
              flexDirection: "column",
            }}>
            <p
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 10px",
                fontFamily: "Poppins",
                fontSize: "14px",
                borderRadius: "5px",
                fontWeight: "500",
                backgroundColor: "#F2F2F2",
                marginBottom: "10px",
                border: "1px solid #E0E0E0",
                color: "#384260",
              }}>
              Application ends on {formatDate(jobData?.jobDeadline)}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "30px",
                alignItems: "center",
                width: "100%",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: "12px",
                  gap: "10px",
                  cursor: "pointer",
                }}>
                <BsChatLeftText
                  title='Message Recruiter'
                  size={24}
                  color='#38486e'
                  onClick={() => {
                    navigate(`/message`, {
                      state: {
                        receiverId: `${jobData.jobPostedBy}`,
                        receiverName: `${jobData.jobCompany.companyName}`,
                      },
                    });
                  }}
                />
              </div>

              <button
                className={`${styles.applyBtn} ${
                  jobData.isAlreadyApplied ? styles.applyBtnDisabled : ""
                }`}
                disabled={jobData.isAlreadyApplied}
                onClick={handleApplyClick}>
                {jobData.isAlreadyApplied ? "Applied" : "Apply Now"}{" "}
                <HiArrowNarrowRight size={18} />
              </button>
              {showApplyModal && (
                <ApplyModal
                  jobTitle={jobData.jobTitle}
                  screeningQuestions={jobData.jobScreeningQuestions.map(
                    (questionObj) => questionObj.question
                  )}
                  onClose={handleCloseModal}
                  onSubmit={handleSubmitApplication}
                />
              )}
            </div>
          </div>
        </div>

        <h5>{jobData.jobLocation}</h5>

        <h3>Job Overview</h3>
        <div
          className={styles.jobOverview}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <p>{jobData.jobDescription}</p>
          <div className={styles.jobSalary}>
            <p>Job Type</p>
            <h5>{jobType(jobData.jobType)}</h5>
            <br />
            <p>Salary</p>
            <h5>
              ₹ {formatAmount(jobData.jobSalary.min)} - ₹{" "}
              {formatAmount(jobData.jobSalary.max)}
            </h5>
          </div>
        </div>
        <h3>Job Skills</h3>
        <div>
          {jobData.jobSkills.map((skill) => (
            <span key={skill} className={styles.tag}>
              {skill}
            </span>
          ))}
        </div>

        <h3>Key Responsibilities</h3>
        <div>
          {jobData.keyResponsibilities.map((benefit) => (
            <span key={benefit} className={styles.tag}>
              {benefit}
            </span>
          ))}
        </div>

        {/* <h3>Job Type</h3>
        <p>{jobType(jobData.jobType)}</p> */}
        <h3>Total number of vacancies</h3>
        <p>{jobData.jobVacancies}</p>

        <h3>Job Benefits</h3>
        <div>
          {jobData.jobBenefits.map((benefit) => (
            <span key={benefit} className={styles.tag}>
              {benefit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
