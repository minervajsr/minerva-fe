import React from "react";
import styles from "./CardSection.module.css";
import { FiMapPin } from "react-icons/fi";
import { HiArrowSmRight } from "react-icons/hi";
const data = {
  category: "Frontend Development",
  title: "React JS Frontend Web Developer ",
  company: "Google",
  location: "Bangalore",
  jopType: "Full Time",
  postedOn: "Posted 2 days ago",
  salary: {
    min: "₹ 66k",
    max: "₹ 72k",
  },
};

const CardSection = () => {
  return (
    <div className={styles.cardContainer}>
      <h6>{data.category}</h6>
      <h2>{data.title}</h2>
      <h4>{data.company}</h4>
      <br />
      <div className={styles.locationContainer}>
        <div className={styles.location}>
          <FiMapPin /> <h5>{data.location}</h5>
        </div>
        <div className={styles.jobType}>
          <h5>{data.jopType}</h5>
        </div>
      </div>
      <br />
      <div className={styles.postedOn}>
        <h5>{data.postedOn}</h5>
      </div>
      <div className={styles.salary}>
        <h5>
          {data.salary.min} - {data.salary.max}
          <span> per month</span>
        </h5>

        <button>
          Apply <HiArrowSmRight />
        </button>
      </div>
    </div>
  );
};

export default CardSection;
