import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import useGet from "./useGet";
import { setUserInfo, clearUserInfo } from "../redux/reducers/user";

const useAuthRedirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);

  const token = localStorage.getItem("token");

  //^ FETCH USER
  const { data, loading, error } = useGet(
    token ? "/user" : null,
    [token]
  );

  //^ STORE USER IN REDUX
  useEffect(() => {
    if (data) {
      dispatch(setUserInfo(data));
    }
  }, [data, dispatch]);

  //^ HANDLE REDIRECT LOGIC
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if (loading) return;

    if (error) {
      dispatch(clearUserInfo());
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    if (user && !user.username) {
      navigate("/complete-profile");
    }
  }, [token, loading, error, user, navigate, dispatch]);
};

export default useAuthRedirect;
