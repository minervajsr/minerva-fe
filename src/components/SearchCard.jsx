import React from "react";
import styles from "./SearchCard.module.css";
import { FiMapPin } from "react-icons/fi";
import { HiArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

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

const JobCard = ({ jobData }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.cardContainer}>
      <div className={styles.jobType}>
        <h5>{jobData.jopType}</h5>
      </div>
      <h6>{jobData.jobCategory}</h6>
      <h2>{jobData.jobTitle}</h2>
      <div
        className={styles.gridlayout}
        style={{
          margin: "10px 0",
        }}>
        <div className={styles.gridItem}>
          <h4>{jobData.jobCompany?.companyName}</h4>
        </div>
        <div
          className={styles.gridItem}
          style={{
            width: "100%",
          }}>
          <h5
            style={{
              fontWeight: 500,
            }}>
            <FiMapPin /> {jobData.jobLocation}
          </h5>
        </div>
      </div>
      <div
        className={styles.gridlayout}
        style={{
          width: "100%",
        }}>
        <div
          style={{
            width: "61%",
            display: "flex",
          }}>
          <div className={styles.gridItem}>
            <h5>
              <b>
                ₹{formatAmount(jobData.jobSalary.min)} - ₹
                {formatAmount(jobData.jobSalary.max)}
              </b>
              <span> monthly</span>
            </h5>
          </div>
          <div className={styles.gridItem}>
            <h5>Posted On {formatDate(jobData.jobPostedAt)}</h5>
          </div>
        </div>

        <div className={styles.salary}>
          <button onClick={() => navigate(`/job/${jobData._id}`)}>
            Apply <HiArrowSmRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
