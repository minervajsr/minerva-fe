// useAxios hook

import { useState, useEffect } from "react";
import axios from "axios";

axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
axios.defaults.withCredentials = true;
// console.log("BASE URL", import.meta.env.VITE_API_URL);

//Get token from local storage

const user = JSON.parse(localStorage.getItem("minervauser"));

//Set token to header

console.log("User", user, user?.token);

axios.defaults.headers.common["Authorization"] = `Bearer ${user?.token || ""}`;

const useAxios = (
  { url, method, body = null, headers = null },
  reload = null
) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const fetchData = () => {
    axios[method](
      url,
      {
        withCredentials: true,
      },
      JSON.parse(headers),
      JSON.parse(body)
    )
      .then((res) => {
        setResponse(res.data);
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [method, url, body, headers, reload]);

  return { response, error, loading };
};

export default useAxios;
