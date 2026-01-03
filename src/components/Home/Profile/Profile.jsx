import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import noDp from "./../../../assets/noDp.png";
import { MoveLeft } from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo);
  const pageState = useSelector(state=>state.pageState.theme);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user,navigate]);

  return (
    <>
      <nav className={`profile-nav ${!pageState?"profile-nav-dark":null}`}>
        <div>
          <button className={` ${!pageState?"profile-nav-back-btn-dark":"profile-nav-back-btn"}`}
           onClick={()=>{
            navigate("/");
           }}>
            <MoveLeft />
          </button>
          <div className="nav-profile-info-container">
            <img src={user?.profilePicture || noDp} alt="" />
              <h3>{user?.username || "username"}</h3>
          </div>
        </div>
      </nav>
      <main></main>
    </>
  );
};

export default Profile;
