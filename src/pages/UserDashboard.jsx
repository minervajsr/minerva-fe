import React, { useState } from "react";
import NavBar from "../components/NavBar";
import styles from "./UserDashboard.module.css";
import SearchBar from "../components/SearchBar";
import JobCard from "../components/JobCard";

import useAxios from "../hooks/useAxios";
import { useAuthContext } from "../hooks/useAuthContext";

const Header = () => {
  return (
    <div className={styles.header}>
      <h1>Your Skill-Crafted Opportunities</h1>
      <p>
        Unlock Your Potential Discover Personalized Job Matches Based on Your
        Unique Skills and Aspirations
      </p>
    </div>
  );
};

const UserDashboard = () => {
  const [reload, setReload] = useState(false);
  const { user } = useAuthContext();

  const { response, loading, error } = useAxios(
    {
      method: "get",
      url: `api/v1/dashboard/${user?._id}`,
      headers: JSON.stringify({ accept: "*/*" }),
    },
    reload
  );

  console.log("response", response);

  return (
    <div>
      <Header />

      <div className={styles.container}>
        <div className={styles.searchBarContainer}>
          <SearchBar />
        </div>
        <div className={styles.jobcardrow}>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <>
              {response?.recommendedJobs?.map((job) => (
                <JobCard key={job._id} jobData={job} />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
