import axiosInstance from "./../APIs/AxiosInstance";
import { useState, useEffect } from "react";

const useGet = (url, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
     if (!url) {
      setData(null);
      setError(null);
      setLoading(false);  
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(url);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, ...dependencies]);

  return { data, loading, error };
};
export default useGet;
