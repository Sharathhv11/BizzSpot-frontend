import { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useSelector, useDispatch } from "react-redux";
import Nav from "./Nav/Nav.jsx";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer/Footer";
import Feed from "./Main/Feed";
import HamBurger from "./Hamburger/HamBurger";

const Home = () => {
  useAuthRedirect();
  const navigate = useNavigate();

  return (
    <>
    <HamBurger/>
      <Nav />
      <Feed/>
      <button  onClick={()=>{
        navigate("/business/697456e1453180af888a83b5");
      }}>
        click me
      </button>
      <Footer/>
    </>
  );
};

export default Home;
