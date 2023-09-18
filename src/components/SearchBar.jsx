import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiMapPin } from "react-icons/fi";
import styles from "./SearchBar.module.css";
import { useNavigate } from "react-router";
import useGoogle from "react-google-autocomplete/lib/usePlacesAutocompleteService";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [dropDownVisibility, setDropDownVisibility] = useState(false);
  const { placePredictions, getPlacePredictions, isPlacePredictionsLoading } =
    useGoogle({
      apiKey: "AIzaSyACFWIzVIxyQqRXnJWGZE9cYHJzWZTXicI",
      debounce: 300,
      types: ["cities"],
    });

  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
      return true;
    }

    if (typeof obj1 !== "object" || typeof obj2 !== "object") {
      return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!deepEqual(obj1[key], obj2[key])) {
        return false;
      }
    }

    return true;
  }

  useEffect(() => {
    console.log(placePredictions);
    if (!deepEqual(placePredictions, predictions) && dropDownVisibility) {
      setPredictions(placePredictions);
    }
  }, [placePredictions, predictions]);

  const parseLocation = (description) => {
    const parts = description.split(", ");
    if (parts.length >= 2) {
      const city = parts[0];
      const country = parts[parts.length - 1];
      return `${city}, ${country}`;
    }
    return description;
  };
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  return (
    <div className={styles.SearchBarContainer}>
      <div className={styles.SearchBarInputContainer}>
        <FiSearch className={styles.SearchBarIcon} />
        <input
          type='text'
          placeholder={`${isMobile ? "Keyword" : "Job title or keyword"}`}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </div>

      <div className={styles.SearchBarInputContainer}>
        <FiMapPin className={styles.SearchBarIcon} />
        {/* <CustomLocation /> */}
        <input
          style={{ color: "black" }}
          value={location}
          placeholder='Anywhere'
          onFocus={() => {
            console.log("FOCUS");
            setDropDownVisibility(true);
          }}
          onBlur={() => {
            console.log("BLUR");
            setTimeout(() => {
              setDropDownVisibility(false);
              setPredictions([]);
            }, 200);
          }}
          onChange={(evt) => {
            getPlacePredictions({ input: evt.target.value });
            setLocation(evt.target.value);
          }}
          loading={isPlacePredictionsLoading}
        />
        {!isPlacePredictionsLoading && (
          <div className={styles.placePredictionContainer}>
            <ul>
              {predictions.map((item) => (
                <li
                  key={item.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    console.log("SET LOCATION");
                    setLocation(parseLocation(item.description));
                    setPredictions([]);
                  }}>
                  <FiMapPin className={styles.mapIcon} />
                  {parseLocation(item.description)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        className={styles.SearchButton}
        onClick={() => {
          console.log(query, location);
          navigate(
            `/search?query=${query}${location ? "&location=" + location : ""}`
          );
        }}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
