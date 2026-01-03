import { useGoogleLogin } from "@react-oauth/google";
import usePost from "./usePost";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/reducers/user";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function useGoogleOauth() {
  const { postData, responseData, loading, error } = usePost();
  const dispatcher = useDispatch();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (authResult) => {
      try {
        const serverResponse = await postData("/auth/google", {
          code: authResult.code,
        });

        const { token, user } = serverResponse.data;

        localStorage.setItem("token", token);
        dispatcher(setUserInfo(user));
        toast.success("signed in successfully");
        navigate("/");
        
      } catch (err) {
        console.error("Backend Google auth failed", err);
      }
    },

    onError: (err) => {
      console.error("Google login popup failed", err);
    },
  });

  return {
    googleLogin,
    data: responseData,
    loading,
    error,
  };
}

export default useGoogleOauth;
