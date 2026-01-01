import { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./Nav/Nav.jsx";

const Home = () => {
  useAuthRedirect();

  const user = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <>
      <Nav />
    </>
  );
};

export default Home;
