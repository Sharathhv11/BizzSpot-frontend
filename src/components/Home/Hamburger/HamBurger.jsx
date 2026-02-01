import React from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, X } from "lucide-react";
import "./hamburger.css";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleHamburgerMenu,
  changeTheme,
} from "./../../../redux/reducers/pageState";

const HamBurger = () => {
  const { hamburgerMenu, theme } = useSelector((state) => state.pageState);
  const dispatch = useDispatch();

  return (
    <div
      className={`hamburger-menu
        ${hamburgerMenu ? "visible-menu" : "hide-menu"}
        ${!theme ? "hamburger-dark" : "hamburger-light"}
      `}
    >
      <button
        className="menu-theme-btn"
        onClick={() => dispatch(changeTheme())}
        aria-label="Toggle theme"
      >
        {theme ? <Moon size={18} /> : <Sun size={18} />}
      </button>
      {/* Close Button */}
      <button
        className={`hamburger-close ${!theme ? "close-dark" : "close-light"}`}
        onClick={() => {
          dispatch(toggleHamburgerMenu());
        }}
      >
        <X size={24} />
      </button>

      <nav className="hamburger-links hamburger-center">
        <a href="#">Explore</a>
        <Link to="/About">About</Link>
        <a href="#footer">Contact</a>
      </nav>
    </div>
  );
};

export default HamBurger;
