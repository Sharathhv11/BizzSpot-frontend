import { useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { popNav } from "../../../redux/reducers/pageState";
import "./nav2.css";
import noDp from "./../../../assets/noDp.png";

const Nav2 = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {navStack,theme} = useSelector((state) => state.pageState);
  const user = useSelector(state => state.user.userInfo);

  return (
    <nav className={`profile-nav ${!theme ? "profile-nav-dark" : ""}`}>
      <div>
        <button
          className={`${
            !theme ? "profile-nav-back-btn-dark" : "profile-nav-back-btn"
          }`}
          onClick={() => {navigate(navStack.length>0 ? navStack[navStack.length-1] : "/");
            dispatch(popNav());
          }}
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
