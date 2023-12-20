import React from "react";
import styles from "./JobCard.module.css";
import { FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { HiArrowSmRight } from "react-icons/hi";
function formatAmount(amount) {
  if (amount >= 1000) {
    const roundedAmount = Math.round(amount / 1000);
    return `${roundedAmount}K`;
  } else {
    return `${amount}`;
  }
}

function calculateDaysAgo(dateString) {
  const currentDate = new Date();
  const postedDate = new Date(dateString);
  const timeDifference = currentDate - postedDate;
  const daysAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  if (daysAgo === 0) {
    return "Posted Today";
  } else if (daysAgo === 1) {
    return "Posted 1 day ago";
  } else {
    return `Posted ${daysAgo} days ago`;
  }
}

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
function capitalizeString(str) {
  if (typeof str !== "string" || str.length < 3) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1).toLocaleLowerCase();
}
const JobCard = ({ jobData }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardContainer}>
      <h6>{capitalizeString(jobData.jobCategory)}</h6>
      <h2>{jobData.jobTitle}</h2>
      <h4>{jobData.jobCompany?.companyName}</h4>
      <div className={styles.locationContainer}>
        <div className={styles.location}>
          <FiMapPin color='#0F6AF5' />{" "}
          <h5>{jobData.jobLocation.split(",")[0]}</h5>
        </div>
        <div className={styles.jobType}>
          <h5>{jobType(jobData.jobType)}</h5>
        </div>
      </div>
      <div className={styles.postedOn}>
        <h5>{calculateDaysAgo(jobData.jobPostedAt)}</h5>
      </div>
      <div className={styles.salary}>
        <h5>
          ₹{formatAmount(jobData.jobSalary.min)} - ₹
          {formatAmount(jobData.jobSalary.max)}
          <span> monthly</span>
        </h5>

        <button onClick={() => navigate(`/job/${jobData._id}`)}>
          Apply <HiArrowSmRight />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
