import { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./Nav/Nav.jsx";
import { useNavigate } from "react-router-dom";

const Home = () => {
  useAuthRedirect();
  const navigate = useNavigate();

  return (
    <>
      <Nav />

      <button onClick={()=>{
        navigate("/profile/695f3abb53254f6b3209429f")
      }}>
        test purpose 
      </button>
    </>
  );
};

export default Home;
