import React, { useState, useEffect } from "react";
import SwitchComp from "./SwitchComp";
import styles from "../pages/JobControlPage.module.css";
import { BsCheck2 } from "react-icons/bs";
import { TbUserQuestion } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { FiEye } from "react-icons/fi";
import { useParams } from "react-router-dom";
import axios from "axios";

const CandidateListCard = ({
  candidateData,
  candidateStatusUpdate,
  activeTab,
}) => {
  const { jobId } = useParams();
  // Function to open the modal

  const openResume = () => {
    // console.log(candidateData?.candidateResume?.secure_url);
    window.open(candidateData?.candidateResume?.secure_url, "_blank");
  };

  function formatDate(inputDateString) {
    const inputDate = new Date(inputDateString);

    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const updateInterest = async (data) => {
    console.log("data", data);
    try {
      const response = await axios.post(`api/v1/update-candidate-status`, data);
      console.log(response);
      candidateStatusUpdate(data);
    } catch (error) {
      console.log(error);
    }
  };

  const InterestSelector = ({ selectorCurrentState, candidateId }) => {
    const [selectorState, setSelectorState] = useState(selectorCurrentState);
    const handleSelectorChange = (state) => {
      setSelectorState(state);

      console.log({
        candidateId,
        jobId,
        candidateStatus: state,
      });

      updateInterest({ candidateId, jobId, candidateStatus: state });
    };

    useEffect(() => {}, [selectorState]);

    let button1Style = {};
    let button2Style = {};
    let button3Style = {};

    if (selectorState === "NEW") {
      button2Style = {
        backgroundColor: "rgb(243, 242, 241)",
        borderColor: "rgb(148, 148, 148)",
        color: "rgb(89, 89, 89)",
      };
    } else if (selectorState === "SHORTLISTED") {
      button1Style = {
        backgroundColor: "rgb(228, 247, 230)",
        borderColor: "rgb(77, 166, 90)",
        color: "rgb(31, 102, 44)",
      };
    } else if (selectorState === "REJECTED") {
      button3Style = {
        backgroundColor: "rgb(254, 238, 239)",
        borderColor: "rgb(247, 98, 102)",
        color: "rgb(169, 37, 43)",
      };
    }

    return (
      <div className={styles.InterestContainer}>
        <button
          className={` ${styles.InterestButtonFirst} ${styles.InterestButton} }`}
          style={button1Style}
          title='Shortlist'
          onClick={() => handleSelectorChange("SHORTLISTED")}>
          <BsCheck2 size={20} />
        </button>
        <button
          className={` ${styles.InterestButtonMiddle} ${styles.InterestButton}}`}
          style={button2Style}
          title='Active'
          onClick={() => handleSelectorChange("NEW")}>
          <TbUserQuestion size={20} />
        </button>
        <button
          className={`${styles.InterestButtonLast} ${styles.InterestButton} }`}
          style={button3Style}
          title='Reject'
          onClick={() => handleSelectorChange("REJECTED")}>
          <RxCross1 size={20} />
        </button>
      </div>
    );
  };

  return (
    <div className={styles.JobDashboardCardContainer}>
      <div>
        <input type='checkbox' />
        <div>
          <h5>{candidateData?.candidateId?.name}</h5>

          <h6>{candidateData?.candidateId?.email}</h6>
          <h6>
            Applied On : {formatDate(candidateData?.candidateId?.createdAt)}
          </h6>
        </div>
      </div>
      <div className={styles.candidates} onClick={openResume}>
        <h6>
          <FiEye size={18} /> View
        </h6>
      </div>

      <div className={styles.screeningTag}>
        {candidateData?.screeningEvaluation.correctAnswers}/
        {candidateData?.screeningEvaluation.totalQuestions} Screening questions
        met
      </div>

      <div>
        {activeTab === "Shortlisted" ? (
          <>
            <SwitchComp
              firstOption='Shortlisted'
              secondOption='Hired'
              size='small'
              setOption={(value) => {
                value === 1 &&
                  updateInterest({
                    candidateId: candidateData?.candidateId?._id,
                    jobId,
                    candidateStatus: value == 1 ? "SHORTLISTED" : "HIRED",
                  });
                value === 2 &&
                  updateInterest({
                    candidateId: candidateData?.candidateId?._id,
                    jobId,
                    candidateStatus: value == 1 ? "SHORTLISTED" : "HIRED",
                  });
              }}
            />
          </>
        ) : (
          <>
            {candidateData?.candidateStatus === "HIRED" ? (
              <div
                className={styles.screeningTag}
                style={{
                  borderColor: "#4DA65A",
                  color: "#4DA65A",
                  background: "#E4F7E6",
                  padding: "4px 28px",
                }}>
                Hired
              </div>
            ) : (
              <>
                <InterestSelector
                  selectorCurrentState={candidateData?.candidateStatus}
                  candidateId={candidateData?.candidateId?._id}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CandidateListCard;
