import { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./Nav/Nav.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useAuthRedirect();


  const user = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    console.log(user);
  }, [user]);

  const navigate = useNavigate();

  return (
    <>
      <Nav />

      <button onClick={()=>{
        navigate("/business/695fb26753254f6b32035a")
      }}>
        test purpose 
      </button>
    </>
  );
};

export default Home;
