import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useGet from "./useGet";
import { setUserInfo, clearUserInfo } from "../redux/reducers/user";

const useAuthRedirect = (path) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  const token = localStorage.getItem("token");

  //^ Fetch user only if token exists
  const { data, loading, error } = useGet(
    token ? "/user" : null,
    [token]
  );

  

  //^ Store user in redux
  useEffect(() => {
    if (data) {
      dispatch(setUserInfo(data?.data));
    }
  }, [data, dispatch]);

  //^ Redirect logic
  useEffect(() => {
    //^ No token → login
    if (!token) {
      navigate("/login");
      return;
    }

    //^ Wait until API finishes
    if (loading) return;

    //^ API error → logout
    if (error) {
      dispatch(clearUserInfo());
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    //^ Profile incomplete
    if (user && !user.username) {
      navigate("/complete-profile");
      return;
    }

    //^ Everything OK → go to requested path
    if (user && path) {
      navigate(path);
    }
  }, [token, loading, error, user, path, navigate, dispatch]);
};

export default useAuthRedirect;
