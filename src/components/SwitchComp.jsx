import React, { useState } from "react";
import styles from "./SwitchComp.module.css";

const SwitchComp = ({
  firstOption = "Full Time",
  secondOption = "Part Time",
  size,
  setOption,
}) => {
  const [selectedOption, setSelectedOption] = useState(1);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === 1) {
      setOption(1);
    }
    if (option === 2) {
      setOption(2);
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        padding: size == "small" ? "8px" : "12",
        borderRadius: size == "small" ? "6px" : "8px",
      }}>
      <div
        className={`${styles.switch} ${
          selectedOption === 1 ? styles.active : ""
        }`}
        onClick={() => handleOptionChange(1)}
        style={{
          padding: size == "small" ? "8px 12px" : "16px 20px",
          fontSize: size == "small" ? "14px" : "16px",
          borderRadius: size == "small" ? "6px" : "8px",
        }}>
        {firstOption}
      </div>
      <div
        className={`${styles.switch} ${
          selectedOption === 2 ? styles.active : ""
        }`}
        onClick={() => handleOptionChange(2)}
        style={{
          padding: size == "small" ? "8px 12px" : "16px 20px",
          fontSize: size == "small" ? "14px" : "16px",
          borderRadius: size == "small" ? "6px" : "8px",
        }}>
        {secondOption}
      </div>
    </div>
  );
};

export default SwitchComp;
