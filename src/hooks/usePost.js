import AxiosInstance from "../APIs/AxiosInstance";

const usePost = (url, data) => {
  const postData = async () => {
    try {
      const response = await AxiosInstance.post(url, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return  {postData} ;
};


export default usePost;