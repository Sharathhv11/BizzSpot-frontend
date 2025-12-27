import AxiosInstance from "./../APIs/AxiosInstance.js";
import { useState, useEffect } from "react";

const usePatch = () => {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState({});
  const [error, setError] = useState(null);

  const patchData = async (url, data, headers = {}) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.patch(url, data,  {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        }});

      setResponseData(response.data);
      return response.data;

    } catch (error) {
        setError(error);
        throw error
    }
    finally{
        setLoading(false);
    }
  };

  return { patchData };
};

export default usePatch;
