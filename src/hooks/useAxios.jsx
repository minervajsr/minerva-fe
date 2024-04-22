// useAxios hook

import { useState, useEffect } from "react";
import axios from "axios";

const useAxios = (
  { url, method, body = null, headers = null },
  reload = null
) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setloading] = useState(true);

  const user = JSON.parse(localStorage.getItem("minervauser"));

  axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`;
  axios.defaults.withCredentials = true;

  axios.defaults.headers.common["Authorization"] = `Bearer ${
    user?.token || ""
  }`;
  // console.log("User FROM AXIOS", user, user?.token);

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
