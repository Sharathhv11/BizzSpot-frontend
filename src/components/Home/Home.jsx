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
        navigate("/profile/697450e3176c569b085d4cdc")
      }}>
        test purpose 
      </button>

      <button className="primary border-2 " onClick={()=>{
        navigate("/payment")
      }}>
        click me to go for payment page
      </button>
    </>
  );
};

export default Home;
