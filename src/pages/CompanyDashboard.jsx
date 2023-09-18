import React, { useState, useEffect } from "react";
import styles from "./CompanyDashboard.module.css";
import SwitchComp from "../components/SwitchComp";
import { FiSearch } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import { useAuthContext } from "../hooks/useAuthContext";
import { FiShare2, FiEdit } from "react-icons/fi";
import { RiDeleteBin7Line } from "react-icons/ri";
import axios from "axios";
import nojobpost from "../assets/nojobpost.svg";

const JobDashboardCard = ({ jobData, triggerRefresh }) => {
  const navigate = useNavigate();

  const updateJobStatus = async (jobId, jobStatus) => {
    const updateJob = await axios.post(`/api/v1/update-job-status`, {
      jobId,
      jobStatus,
    });

    triggerRefresh();
    console.log(updateJob);
  };

  function handleStatusChange(id, jobstatus) {
    updateJobStatus(id, jobstatus);
  }
  function formatDate(inputDateString) {
    const inputDate = new Date(inputDateString);

    const options = { day: "numeric", month: "long", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-US", options);

    return formattedDate;
  }

  const newCandidates = jobData.jobApplications.filter((job) => {
    return job.candidateStatus === "NEW";
  });

  const shortlistedCandidates = jobData.jobApplications.filter((job) => {
    return job.candidateStatus === "SHORTLISTED";
  });

  const hiredCandidates = jobData.jobApplications.filter((job) => {
    return job.candidateStatus === "HIRED";
  });

  console.log(newCandidates);
  return (
    <div className={styles.JobDashboardCardContainer}>
      <div>
        <input type='checkbox' />
        <div>
          <Link to={`/company/job/${jobData._id}`}>
            <h5>{jobData.jobTitle}</h5>
          </Link>
          <h6>{jobData.location}</h6>
          <h6>
            Created: {formatDate(jobData.jobPostedAt)} - Ends:{" "}
            {formatDate(jobData.jobDeadline)}
          </h6>
        </div>
      </div>
      <div className={styles.candidates}>
        <div>
          <h5>{newCandidates.length}</h5>
          <h5>New</h5>
        </div>

        <div>
          <h5>{shortlistedCandidates.length}</h5>
          <h5>Shortlisted</h5>
        </div>

        <div>
          <h5>
            {hiredCandidates.length} of {jobData?.jobVacancies ?? 0}
          </h5>
          <h5>Hired</h5>
        </div>
      </div>

      <div>
        <select
          value={jobData.jobStatus}
          onChange={(val) => {
            console.log(val.target.value);
            handleStatusChange(jobData._id, val.target.value);
          }}>
          <option value='OPEN'>Open</option>
          <option value='CLOSED'>Closed</option>
        </select>
      </div>
      <div>
        <button>
          <FiShare2 />
        </button>
        <button>
          <RiDeleteBin7Line />
        </button>
        <button onClick={() => navigate(`/company/post-job/${jobData._id}`)}>
          <FiEdit />
        </button>
      </div>
    </div>
  );
};

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [jobList, setJobList] = useState([]);
  const [jobListStatus, setJobListStatus] = useState(1);
  const [reload, setReload] = useState(false);

  const { response, loading, error } = useAxios(
    {
      method: "get",
      url: `api/v1/company-user-dashboard/${user._id}`,
      headers: JSON.stringify({ accept: "*/*" }),
    },
    reload
  );
  const triggerRefresh = () => {
    setReload(!reload);
    console.log("REFRESH");
  };

  useEffect(() => {
    if (response && jobListStatus === 1) {
      console.log("OPEN JOBS");
      setJobList(response?.jobs?.filter((job) => job.jobStatus === "OPEN"));
    } else {
      console.log("CLOSED JOBS");
      setJobList(response?.jobs?.filter((job) => job.jobStatus === "CLOSED"));
    }
  }, [loading, response, jobListStatus]);

  useEffect(() => {
    console.log("JobList", jobList);
  }, [jobList]);

  const handleSearch = (searchKeyword) => {
    const filteredJobs = jobList.filter((job) => {
      const jobDescription = job.jobDescription.toLowerCase();
      const jobTitle = job.jobTitle.toLowerCase();
      return (
        jobDescription.includes(searchKeyword.toLowerCase()) ||
        jobTitle.includes(searchKeyword.toLowerCase())
      );
    });

    if (searchKeyword === "") {
      if (response && jobListStatus === 1) {
        setJobList(response?.jobs?.filter((job) => job.jobStatus === "OPEN"));
      } else {
        setJobList(response?.jobs?.filter((job) => job.jobStatus === "CLOSED"));
      }
    } else {
      setJobList(filteredJobs);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (jobList && jobList.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
          height: "calc(100vh - 80px)",
        }}>
        <img
          src={nojobpost}
          alt=''
          style={{
            width: "26%",
            objectFit: "contain",
            marginBottom: "-40px",
          }}
        />
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 600,
            color: "#1E255E",
          }}>
          {" "}
          No Job Post Found In this Account!{" "}
        </h2>
        <button
          className={styles.button}
          onClick={() => navigate("/company/post-job")}>
          Post a Job
        </button>
      </div>
    );
  }
  return (
    <div className={styles.CompanyDashboardContainer}>
      <div className={styles.CompanyDashboardControls}>
        <div className={styles.CompanyDashboardControlsLeft}>
          <SwitchComp
            firstOption='Open'
            setOption={setJobListStatus}
            secondOption='Closed'
            size={"small"}
          />
        </div>
        <div className={styles.CompanyDashboardControlsRight}>
          <div className={styles.searchContainer}>
            <FiSearch className={styles.SearchBarIcon} />
            <input
              type='text'
              placeholder='Search'
              onChange={(e) => handleSearch(e.target.value)}
            />
            {/* <button>Search</button> */}
          </div>
          <div>
            <button
              className={styles.button}
              onClick={() => navigate("/company/post-job")}>
              Post a Job
            </button>
          </div>
        </div>
      </div>
      <div className={styles.CompanyDashboardTable}>
        <div className={styles.TableHeader}>
          <div>
            <input type='checkbox' />
            <span>Job Title</span>
          </div>
          <div>
            <span>Candidates</span>
          </div>
          <div>
            <span>Job Status</span>
          </div>
          <div>
            <span>Action</span>
          </div>
        </div>
        <div className={styles.TableBody}>
          {jobList?.map((job) => (
            <JobDashboardCard
              key={job._id}
              jobData={job}
              triggerRefresh={triggerRefresh}
            />
          ))}
        </div>
      </div>
      <div className={styles.CompanyDashboardPaging}></div>
    </div>
  );
};

export default CompanyDashboard;
