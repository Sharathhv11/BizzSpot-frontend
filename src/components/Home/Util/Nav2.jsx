import { useNavigate } from "react-router-dom";
import {MoveLeft} from "lucide-react"
import "./nav2.css"
import noDp from "./../../../assets/noDp.png";

const Nav2 = ({ pageState, user,redirect }) => {
  const navigate = useNavigate();
  return (
    <nav className={`profile-nav ${!pageState ? "profile-nav-dark" : ""}`}>
      <div>
        <button
          className={`${
            !pageState ? "profile-nav-back-btn-dark" : "profile-nav-back-btn"
          }`}
          onClick={() => navigate(redirect?redirect:"/")}
        >
          <MoveLeft />
        </button>

        <div className="nav-profile-info-container">
          <img src={user?.profilePicture || noDp} alt="profile" />
          <h3>{user?.username}</h3>
        </div>
      </div>
    </nav>
  );
};

export default Nav2;
