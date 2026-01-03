import "./nav.css";
import { useSelector, useDispatch } from "react-redux";
import { changeTheme } from "../../../redux/reducers/pageState";
import logoLight from "./../../../assets/logo.png";
import logoDark from "./../../../assets/logoD.png";
import dftImage from "./../../../assets/noDp.png";
import { Search, Sun, Moon, Menu, LogOut, CircleUser, Settings } from "lucide-react";
import { Link } from "react-router-dom"

const Nav = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const isLight = useSelector((state) => state.pageState.theme);
  const dispatch = useDispatch();

  return (
    <header className={`navv2 ${isLight ? "light" : "dark"}`}>
      <div className="navv2-inner">
        {/* LOGO */}
        <div className="navv2-logo">
          <img src={isLight ? logoLight : logoDark} alt="NearGo" />
        </div>

        {/* CENTER LINKS */}
        <nav className="navv2-links">
          <a href="#">Explore</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>

        {/* ACTIONS */}
        <div className="navv2-actions">
          <button
            className="icon-btn"
            onClick={() => dispatch(changeTheme())}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button className="search-btn">
            <Search size={16} />
            <span className="search-text">Search nearby</span>
          </button>

          {/* PROFILE */}
          <div className="profile">
            <img src={userInfo?.profilePicture || dftImage} alt="profile" />
            <div className="profile-menu">
              <button>
                <Link to="/profile" className="w-full h-full flex gap-1.5 items-center justify-start">
                <CircleUser/>
                <span>Profile</span>
                </Link>
                </button>
              <button>
                <Settings/>
                <span>Settings</span></button>
              <div className="divider" />
              <button className="danger">
                <LogOut />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          <button className="mobile-menu-btn">
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Nav;
