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
        navigate("/profile/695f39c4770edd681df381c7")
      }}>
        test purpose 
      </button>
    </>
  );
};

export default Home;
