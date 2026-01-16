import AxiosInstance from "../APIs/AxiosInstance";
import { useState } from "react";

const useDelete = () => {
  const [responseData, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const deleteData = async (url, headers = {}) => {
    setLoading(true);
    try {
      const response = await AxiosInstance.delete(url, {
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

  return { deleteData, responseData, error, loading };
};

export default useDelete;
