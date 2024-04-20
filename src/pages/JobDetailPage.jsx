import React, { useState } from "react";
import styles from "./JobDetailPage.module.css";
import useAxios from "../hooks/useAxios";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import JobCard from "../components/JobCard";
import ApplyModal from "../components/ApplyModal";
import { PiMapPinBold } from "react-icons/pi";
import { IoMdMail } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FiCalendar } from "react-icons/fi";

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
const JobDetailPage = () => {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const { jobId } = useParams();
  const { response, loading, error } = useAxios({
    method: "get",
    url: `api/v1/job/${jobId}`,
    reload: refresh,
  });
  const [showApplyModal, setShowApplyModal] = useState(false);

  const handleApplyClick = () => {
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
  };

  // const handleSubmitApplication = (applicationData) => {
  //   // Handle the submission of the application data here
  //   console.log("Application Data:", applicationData);
  //   applyForJob(applicationData);
  //   // Close the modal after submission
  // };

  if (loading) {
    return <h1>Loading...</h1>;
  }

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

      <div className={styles.jobDetail}>
        <div className={styles.jobDetailHeader}>
          <div className={styles.jobDetailHeaderLeft}>
            <div className={styles.jobDetailHeaderLeftTitle}>
              {jobData.jobTitle}
            </div>
            <div className={styles.jobDetailHeaderLeftSubTitle}>
              {jobData.jobCompany.companyName}
            </div>
            <div className={styles.jobDetailHeaderLeftSubTitle}>
              {jobData.jobLocation}
            </div>
          </div>

          <div className={styles.jobDetailHeaderRight}>
            <div className={styles.deadlineTag}>
              <FiCalendar color='#384260' size={24} />

              {formatDate(jobData.jobDeadline)}
            </div>
          </div>
        </div>
        <br />
      </div>
      <div className={styles.jobDetailBody}>
        <div className={styles.jobDetailBodyLeft}>
          <div className={styles.jobDetailBodyItem}>
            <div className={styles.jobDetailBodyItemTitle}>Overview</div>
            <div className={styles.jobDetailBodyItemValue}>
              {jobData.jobDescription}
            </div>
          </div>
          <br />
          <div className={styles.jobDetailBodyItem}>
            <div className={styles.jobDetailBodyItemTitle}>
              Responsibilities
            </div>
            <div className={styles.jobDetailBodyItemValue}>
              {
                <ul>
                  {jobData.keyResponsibilities.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              }
            </div>
          </div>

          <div className={styles.jobDetailBodyItem}>
            <div className={styles.jobDetailBodyItemTitle}>Benifits</div>
            <div className={styles.jobDetailBodyItemValue}>
              {
                <ul>
                  {jobData.jobBenefits.map((item) => (
                    <li>{item}</li>
                  ))}
                </ul>
              }
            </div>
          </div>

          <div className={styles.jobDetailBodyItem}>
            <div className={styles.jobDetailBodyItemTitle}>Skills</div>
            <div className={styles.jobDetailBodyItemValue}>
              {jobData.jobSkills.map((item) => (
                <div
                  style={{
                    display: "inline-block",
                    padding: "12px 24px",
                    margin: "5px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "rgba(56, 66, 96, 0.7)",
                    borderRadius: "50px",
                    backgroundColor: "#f2f2f2",
                    textTransform: "capitalize",
                  }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.jobDetailBodyRight}>
          <div className={styles.jobDetailBodyRightItem}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "600",
                color: "#383E60",
                fontSize: "18px",
              }}>
              <PiMapPinBold size={24} /> {jobData.jobLocation.split(",")[0]}
            </div>
            <p
              style={{
                fontSize: "14px",
                color: "#8083A3",
                marginTop: "10px",
              }}>
              Please send us your detailed CV to apply for this job post
            </p>
            <br />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontWeight: "600",
                color: "#383E60",
                fontSize: "18px",
              }}>
              {/* Salary */}
              {
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontWeight: "800",
                    color: "#383E60",
                    fontSize: "24px",
                  }}>
                  ₹{formatAmount(jobData.jobSalary.min)} - ₹
                  {formatAmount(jobData.jobSalary.max)}
                </div>
              }
            </div>
            <p
              style={{
                marginTop: "-5px",
              }}>
              Avg. salary
            </p>

            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  backgroundColor: "#F5F5FA",
                  borderRadius: "50px",
                  color: "#1E255E !important",
                }}>
                <IoMdMail size={20} color='#1E255E' />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    color: "#1E255E",
                    fontWeight: "600",
                  }}>
                  {jobData.jobCompany.companyEmail}
                </h4>
                <p
                  style={{
                    color: "#8083A3",
                    fontSize: "14px",
                    marginTop: "2px",
                  }}>
                  Contact Email
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  backgroundColor: "#F5F5FA",
                  borderRadius: "50px",
                  color: "#1E255E !important",
                }}>
                <IoMdMail size={20} color='#1E255E' />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    color: "#1E255E",
                    fontWeight: "600",
                  }}>
                  {jobType(jobData.jobType)}
                </h4>
                <p
                  style={{
                    color: "#8083A3",
                    fontSize: "14px",
                    marginTop: "2px",
                  }}>
                  Job Type
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                marginTop: "20px",
                alignItems: "center",
                gap: "20px",
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "15px",
                  backgroundColor: "#F5F5FA",
                  borderRadius: "50px",
                  color: "#1E255E !important",
                }}>
                <IoMdMail size={20} color='#1E255E' />
              </div>
              <div>
                <h4
                  style={{
                    fontSize: "18px",
                    color: "#1E255E",
                    fontWeight: "600",
                  }}>
                  {jobData.jobCategory}
                </h4>
                <p
                  style={{
                    color: "#8083A3",
                    marginTop: "2px",
                    fontSize: "14px",
                  }}>
                  Job Category
                </p>
              </div>
            </div>

            <button
              className={`${styles.applyBtn} ${
                jobData.isAlreadyApplied ? styles.applyBtnDisabled : ""
              }`}
              disabled={jobData.isAlreadyApplied}
              onClick={handleApplyClick}>
              {jobData.isAlreadyApplied ? "Applied" : "Apply for this job"}
              {/* <HiArrowNarrowRight size={18} /> */}
            </button>
            {showApplyModal && (
              <ApplyModal
                jobId={jobId}
                jobTitle={jobData.jobTitle}
                screeningQuestions={jobData.jobScreeningQuestions.map(
                  (questionObj) => questionObj.question
                )}
                onClose={handleCloseModal}
                onSubmit={() => setRefresh(!refresh)}
              />
            )}
          </div>
          <br />
          <br />

          <div className={styles.jobDetailBodyRightItem}>
            <div>
              <h4
                style={{
                  fontSize: "24px",
                  color: "#1E255E",
                  fontWeight: "600",
                }}>
                {jobData.jobCompany.companyName}
              </h4>
              <p
                style={{
                  color: "#8083A3",
                  fontSize: "14px",
                  marginTop: "2px",
                }}>
                We are committed to creating an inclusive for all employees.
              </p>
            </div>

            <button
              style={{
                width: "100%",
                padding: "22px",
                borderRadius: "12px",
                backgroundColor: "#F5F5FA",
                color: "#212121",
                border: "none",
                marginTop: "20px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
              onClick={() => {
                // Log the companyWebsite value
                console.log(jobData.jobCompany.companyWebsite);

                // Check if the URL starts with http:// or https://
                let url = jobData.jobCompany.companyWebsite;
                if (!url.startsWith("http://") && !url.startsWith("https://")) {
                  // Add http:// if it's missing
                  url = "http://" + url;
                }

                // Open webpage in new tab
                window.open(url, "_blank");
              }}>
              Learn more about us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
