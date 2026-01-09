import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import noDp from "./../../../assets/noDp.png";
import useGet from "./../../../hooks/useGet";
import {
  SquarePen,
  MapPin,
  Phone,
  Star,
  BadgeCheck,
  Store,
} from "lucide-react";
import Nav2 from "../Util/Nav2";
import businessPlaceHolder from "./../../../assets/businessPlaceHolder.png"


import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography"

import { setUserBusiness } from "../../../redux/reducers/user";

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
      <Nav2 pageState={pageState} user={user} />
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


const greenRatingStyle = (theme) => ({
  "& .MuiRating-iconFilled": {
    color: theme.palette.success.main,
  },
  "& .MuiRating-iconHover": {
    color: theme.palette.success.dark,
  },
});

const Main = ({ user, pageState: theme, updateFollowList }) => {
  //* api call to get the user profile information
  const { data } = useGet(user?.id ? `follow/count?userID=${user?.id}` : null);

  const dispatch = useDispatch();
  const { usersBusiness, hasFetchedBusinesses } = useSelector(
    (state) => state.user
  );

  const shouldFetch = user?.id && !hasFetchedBusinesses;

  const { data: businessList } = useGet(
    shouldFetch ? `business?ownedBy=${user?.id}` : null
  );

  useEffect(() => {
    if (businessList?.data && !hasFetchedBusinesses) {
      dispatch(setUserBusiness(businessList.data));
    }
  }, [businessList, hasFetchedBusinesses, dispatch]);

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
        <div className="business_registration-container">
          {usersBusiness?.length > 0 ? (
            usersBusiness.map((business) => (
              <div className="business-rich" key={business._id}>
                {/* Image */}
                <div className="business-img-wrapper">
                  <img
                    src={business.profile || businessPlaceHolder}
                    alt={business.businessName}
                    className="business-rich-img"
                  />
                </div>

                {/* Info */}
                <div className="business-rich-info">
                  {/* Header */}
                  <div className="business-rich-header">
                    <div className="title">
                      <Store size={18} />
                      <h3>{business.businessName}</h3>
                    </div>

                    <span
                      className={`business-status ${
                        business.status === "Open" ? "open" : "closed"
                      }`}
                    >
                      {business.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="business-rich-desc">{business.description}</p>

                  {/* Meta */}
                  <div className="business-rich-meta">
                    <span>
                      <MapPin size={16} />
                      {business.location.area}, {business.location.city},{" "}
                      {business.location.state}
                    </span>

                    <span>
                      <Phone size={16} />+
                      {business.phoneNo?.[0]?.phone?.countryCode}{" "}
                      {business.phoneNo?.[0]?.phone?.number}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="business-rich-footer">
                    <span className="rating">
                      <Star size={16} />
                      {business.rating.totalReview > 0
                        ? (
                            business.rating.sumOfReview /
                            business.rating.totalReview
                          ).toFixed(1)
                        : "New"}
                    </span>

                    <span className="completion">
                      <BadgeCheck size={16} />
                      {business.profileCompletion}% Complete
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="business-not-registered-container"
              onClick={() => {
                navigate("/register-business");
              }}
            >
              <span>not yet registered Business</span>
              <div></div>
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
