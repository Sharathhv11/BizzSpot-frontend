import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import noDp from "./../../../assets/noDp.png";
import useGet from "./../../../hooks/useGet";
import { SquarePen } from "lucide-react";
import Nav2 from "../Util/Nav2";

const Profile = () => {
  const user = useSelector((state) => state.user.userInfo);
  const pageState = useSelector((state) => state.pageState.theme);
  const navigate = useNavigate();
  const [showFollowList, setShowFollowList] = useState(false);

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

  return (
    <>
      <Nav2 pageState={pageState} user={user}  />
      <Main
        user={user}
        pageState={pageState}
        updateFollowList={setShowFollowList}
      />
      <FollowList
        visibility={showFollowList}
        updateVisibility={setShowFollowList}
      />
    </>
  );
};

/* ================= NAV ================= */

// const Nav = ({ pageState, user, navigate }) => {
//   return (
//     <nav className={`profile-nav ${!pageState ? "profile-nav-dark" : ""}`}>
//       <div>
//         <button
//           className={`${
//             !pageState ? "profile-nav-back-btn-dark" : "profile-nav-back-btn"
//           }`}
//           onClick={() => navigate("/")}
//         >
//           <MoveLeft />
//         </button>

//         <div className="nav-profile-info-container">
//           <img src={user?.profilePicture || noDp} alt="profile" />
//           <h3>{user?.username}</h3>
//         </div>
//       </div>
//     </nav>
//   );
// };

const Main = ({ user, pageState: theme, updateFollowList }) => {
  const { data } = useGet(user?.id ? `follow/count?userID=${user?.id}` : null);

  const { data: businessList } = useGet(
    user?.id ? `business?ownedBy=${user?.id}` : null
  );

  const navigate = useNavigate();

  return (
    <main
      className={`profile-main ${
        theme ? "light-profile-main" : "dark-profile-main"
      }`}
    >
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
            <button
              className="profile-following"
              onClick={() => {
                updateFollowList(true);
              }}
            >
              <span>Following</span>
              <span className="follow-count">{data?.data?.count ?? 0}</span>
            </button>

            {/* Edit Button */}
            <button className="edit-btn">
              <SquarePen size={16} />
              Edit
            </button>
          </div>
        </div>
        <div className="business_registration-container" onClick={()=>{
          navigate("/register-business")
        }}>
          {businessList?.data?.length > 0 ? (
            <div>
              {/* this div is when user  have any business registered */}
            </div>
          ) : (
            <div className="business-not-registered-container" >
              <span>
                not yet registered Business
              </span>
              <div>

              </div>
             
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

const FollowList = function ({ visibility, setShowFollowList }) {
  return (
    <section
      className="user-following-list"
      style={{
        display: visibility ? "block" : "none",
      }}
    >
      yeah this is the following list
    </section>
  );
};

export default Profile;
