import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import noDp from "./../../../assets/noDp.png";
import { MoveLeft } from "lucide-react";
import useGet from "./../../../hooks/useGet";
import { SquarePen } from "lucide-react";

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo);
  const pageState = useSelector((state) => state.pageState.theme);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <>
      <Nav pageState={pageState} user={user} navigate={navigate} />
      <Main user={user} pageState={pageState} />
    </>
  );
};

/* ================= NAV ================= */

const Nav = ({ pageState, user, navigate }) => {
  return (
    <nav className={`profile-nav ${!pageState ? "profile-nav-dark" : ""}`}>
      <div>
        <button
          className={`${
            !pageState ? "profile-nav-back-btn-dark" : "profile-nav-back-btn"
          }`}
          onClick={() => navigate("/")}
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



const Main = ({ user, pageState }) => {
  const { data } = useGet(
    user?.id ? `follow/count?userID=${user?.id}` : null
  );

  return (
    <main className="profile-main">
      <section>
        <div className="profile-header">
          {/* Profile Image */}
          <img src={user?.profilePicture || noDp} alt="profile" />

          {/* Right Section */}
          <div className="profile-right">
            {/* User Info */}
            <div className="profile-info">
              <h1>{user?.name || "Name"}</h1>
              <span>{user?.email || "email"}</span>
              <span>{user?.phone_no || "phone number"}</span>
            </div>

            {/* Following */}
            <div className="profile-following">
              <span>Following</span>
              <span className="follow-count">
                {data?.data?.count ?? 0}
              </span>
            </div>

            {/* Edit Button */}
              <button className="edit-btn">
                <SquarePen size={16} />
                Edit
              </button>
          </div>
        </div>

        <div className="profile-divider" />
      </section>
    </main>
  );
};
export default Profile;
