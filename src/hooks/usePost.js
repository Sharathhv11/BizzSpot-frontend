import AxiosInstance from "../APIs/AxiosInstance";
import { useState } from "react";

const usePost = () => {
  const [responseData, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const postData = async (url, data, headers = {}) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { postData, responseData, error, loading };
};

export default usePost;
