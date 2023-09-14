import React, { useEffect, useState, useRef } from "react";
import styles from "./JobControlPage.module.css";
import { FiShare2 } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { BiChevronRight } from "react-icons/bi";
import CandidateListCard from "../components/CandidateListCard";

import { BsCheck2 } from "react-icons/bs";
import { TbUserQuestion } from "react-icons/tb";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import axios from "axios";

let _tempAllCandidates = [];

const JobControlPage = () => {
  const [candidateList, setCandidateList] = useState([]);
  const { jobId } = useParams();
  console.log(jobId);
  const { response, loading, error } = useAxios({
    method: "get",
    url: `/api/v1/company-job/${jobId}`,
    headers: JSON.stringify({ accept: "*/*" }),
  });

  const candidateStatusUpdate = async (data) => {
    //Update the candidate status in the list of candidates
    const updatedCandidateList = candidateList.map((candidate) => {
      if (candidate.candidateId._id === data.candidateId) {
        candidate.candidateStatus = data.candidateStatus;
      }
      return candidate;
    });
    console.log(updatedCandidateList);
    _tempAllCandidates = updatedCandidateList;
    setCandidateList(updatedCandidateList);
  };

  useEffect(() => {
    if (!loading) {
      const correctAnswersList = response?.data?.jobScreeningQuestions.map(
        (item) => {
          return item.answer.toString();
        }
      );

      // console.log("correctAnswersList", correctAnswersList);

      response?.data?.jobApplications.map((candidateData) => {
        candidateData.screeningEvaluation = {
          correctAnswers: 0,
          totalQuestions: correctAnswersList.length,
        };

        candidateData.candidateScreeningAnswers.map((answer, index) => {
          if (String(answer) == String(correctAnswersList[index])) {
            candidateData.screeningEvaluation.correctAnswers += 1;
          }
        });

        return candidateData;
      });

      console.log(response?.data?.jobApplications);
      _tempAllCandidates = response?.data?.jobApplications;
      setCandidateList(response?.data?.jobApplications);
    }
  }, [loading]);

  const [activeTab, setActiveTab] = useState("All Candidates");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const filterBarRef = useRef(null);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleSearch = (searchText) => {
    if (searchText.length === 0) {
      setCandidateList(_tempAllCandidates);
      return;
    }

    const lowerSearchText = searchText.toLowerCase(); // Convert search input to lowercase for case-insensitive search

    // Filter candidates whose name or email contains the search input
    const filteredCandidates = _tempAllCandidates.filter((candidate) => {
      const candidateName = candidate.candidateId.name.toLowerCase();
      const candidateEmail = candidate.candidateId.email.toLowerCase();
      return (
        candidateName.includes(lowerSearchText) ||
        candidateEmail.includes(lowerSearchText)
      );
    });

    // Update the filtered candidate list state
    setCandidateList(filteredCandidates);
  };
  const getTabIndex = (tabName) => {
    const tabs = [
      "All Candidates",
      "Active",
      "Awaiting review",
      "Shortlisted",
      "Hired",
      "Rejected",
    ];
    return tabs.indexOf(tabName);
  };

  useEffect(() => {
    const tabWidth = filterBarRef.current?.clientWidth || 0;
    const tabIndex = getTabIndex(activeTab);
    const translateX = tabIndex * tabWidth;

    if (filterBarRef.current) {
      filterBarRef.current.style.transform = `translateX(${translateX}px)`;
    }

    if (activeTab === "All Candidates") {
      setCandidateList(_tempAllCandidates);
    } else if (activeTab === "Active") {
      setCandidateList(
        _tempAllCandidates.filter(
          (candidate) => candidate.candidateStatus === "NEW"
        )
      );
    } else if (activeTab === "Pending review") {
      setCandidateList(
        _tempAllCandidates.filter(
          (candidate) => candidate.candidateStatus === "PENDING_REVIEW"
        )
      );
    } else if (activeTab === "Shortlisted") {
      setCandidateList(
        _tempAllCandidates.filter(
          (candidate) => candidate.candidateStatus === "SHORTLISTED"
        )
      );
    } else if (activeTab === "Hired") {
      setCandidateList(
        _tempAllCandidates.filter(
          (candidate) => candidate.candidateStatus === "HIRED"
        )
      );
    } else if (activeTab === "Rejected") {
      setCandidateList(
        _tempAllCandidates.filter(
          (candidate) => candidate.candidateStatus === "REJECTED"
        )
      );
    }
  }, [activeTab]);
  return (
    <div className={styles.jobControlPageContainer}>
      <div className={styles.CompanyDashboardTable}>
        <h2>
          {response?.data?.jobTitle}{" "}
          <span> | {response?.data?.jobLocation}</span>
        </h2>
        <div className={styles.SubContainer}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#1E255E",
              fontFamily: "Poppins",
              fontSize: "18px",
            }}>
            <p className={styles.filterButton} onClick={() => {}}>
              Filters <BiChevronRight size={24} />
            </p>
          </div>
          <div className={styles.filterContainer}>
            <div className='filter-bar' ref={filterBarRef}></div>
            {[
              "All Candidates",
              "Active",
              "Shortlisted",
              "Hired",
              "Rejected",
            ].map((tab) => (
              <div
                key={tab}
                className={`${styles.filter} ${
                  activeTab === tab && styles.active
                }`}
                onClick={() => handleTabClick(tab)}>
                {tab}
              </div>
            ))}
          </div>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.SearchBarIcon} />
            <input
              type='text'
              placeholder='Search'
              onChange={(e) => handleSearch(e.target.value)}
            />
            {/* <button>Search</button> */}
          </div>
        </div>

        <div className={styles.TableHeader}>
          <div>
            <input type='checkbox' />
            <span>Candidate</span>
          </div>
          <div>
            <span>Resume</span>
          </div>
          <div>
            <span>Screener Questions</span>
          </div>
          <div>
            <span>Interest</span>
          </div>
        </div>
        <div className={styles.TableBody}>
          {candidateList &&
            candidateList?.map((candidate) => (
              <CandidateListCard
                activeTab={activeTab}
                candidateStatusUpdate={candidateStatusUpdate}
                key={candidate._id}
                candidateData={candidate}
              />
            ))}
        </div>
      </div>
      <div className={styles.CompanyDashboardPaging}></div>
    </div>
  );
};

export default JobControlPage;
