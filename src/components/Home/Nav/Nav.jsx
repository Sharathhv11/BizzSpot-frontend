import React from "react";
import "./nav.css";
import { useSelector } from "react-redux";
import dftImage from "./../../../assets/noDp.png";
import logo from "./../../../assets/logo.png";
import { Search, Sun } from "lucide-react";

const Nav = () => {
  const userInfo = useSelector((state) => state.user.userInfo);

  return (
    <nav className="nav">
      <div className="nav-container">
        <div className="nav-logo">
          <img src={logo} alt="bizzSpot" />
        </div>

        <div className="nav-right">
          <div className="nav-links">
            <div className="nav-actions">
              <button className="theme-btn" aria-label="Toggle theme">
                <Sun size={18} />
              </button>

              <button className="search-tab">
                Search
                <Search size={16} />
              </button>
            </div>

            <ul className="nav-menu">
              <li>Explore</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="nav-profile">
            <img src={userInfo?.profilePicture || dftImage} alt="profile" />
            <div className="hover-menu">
              <ul>
                <li>Explore</li>
                <li>About</li>
                <li>Contact</li>
              </ul>
            </div>  
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
