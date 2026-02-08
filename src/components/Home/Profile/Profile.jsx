import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
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
  TriangleAlert,
  LoaderCircle,
} from "lucide-react";
import Nav2 from "../Util/Nav2";
import businessPlaceHolder from "./../../../assets/businessPlaceHolder.png";
import blueTick from "./../../../assets/blueTick.png";

import { setUserBusiness } from "../../../redux/reducers/user";
import { pushNav } from "../../../redux/reducers/pageState";
import getUserFriendlyMessage from "../../../utils/userFriendlyErrors";

import FollowList from "../Util/FollowList";

const Profile = () => {
  const { userID } = useParams();

  //^ states presents in the redux store
  let user = useSelector((state) => state.user.userInfo);
  const pageState = useSelector((state) => state.pageState.theme);

  const navigate = useNavigate();
  const [showFollowList, setShowFollowList] = useState(false);
  const [owner, setOwner] = useState(false);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (userID === user?.id) {
      setOwner(true);
    }
  }, [userID, user]);

  const {
    data: userData,
    loading,
    error,
  } = useGet(!owner ? `user?userID=${userID}` : null);

  const targetUser = owner ? user : userData?.data;

  return (
    <>
      <Nav2 pageState={pageState} user={targetUser} redirect={`/`} />
      {error ? (
        <div className="broken-link-container">
          <div>
            <img src={noDp} alt="business not found" />
          </div>
          <div>
            <div className="error-lucide">
              <TriangleAlert />
            </div>
            {getUserFriendlyMessage(error)}
          </div>
        </div>
      ) : (
        <>
          <Main
            user={targetUser}
            pageState={pageState}
            updateFollowList={setShowFollowList}
            showFollowList={showFollowList}
            owner={owner}
          />
        </>
      )}
    </>
  );
};

const Main = ({
  user,
  pageState: theme,
  updateFollowList,
  owner,
  showFollowList,
}) => {
  const [followCount, updateFollowCount] = useState(0);
  const { data } = useGet(user?.id ? `follow/count?userID=${user?.id}` : null);

  useEffect(() => {
    if (data?.data) {
      updateFollowCount(data?.data?.count);
    }
  }, [data]);

  const dispatch = useDispatch();
  const { usersBusiness: ownerBusiness, hasFetchedBusinesses } = useSelector(
    (state) => state.user,
  );

  const shouldFetchBusinesses =
    user?.id && (!owner || (!hasFetchedBusinesses && owner));
  const { data: businessList, loading } = useGet(
    shouldFetchBusinesses ? `business/owned?ownedBy=${user?.id}` : null,
  );

  //  COMPUTED: Use Redux for owner, API for others
  const displayBusinesses = owner
    ? ownerBusiness || []
    : businessList?.data || [];

  useEffect(() => {
    if (businessList?.data && owner && !hasFetchedBusinesses) {
      dispatch(setUserBusiness(businessList.data));
    }
  }, [businessList?.data, owner, hasFetchedBusinesses, dispatch]);

  const navigate = useNavigate();

  return (
    <>
      <main
        className={`profile-main ${
          theme ? "light-profile-main" : "dark-profile-main"
        }`}
      >
        <section>
          <div className="profile-header">
            <img src={user?.profilePicture || noDp} alt="profile" />
            <div className="profile-right">
              <div className="profile-info">
                <h1 className="flex items-center ">
                  {user?.name || "Name"}
                  {user?.account?.type === "premium" && (
                    <span>
                      <img
                        src={blueTick}
                        alt={"blue tick"}
                        className="blue-tick"
                      />
                    </span>
                  )}
                </h1>
                <span>{user?.email || "email"}</span>
                <span>{user?.phone_no || "phone number"}</span>
              </div>
              <button
                className="profile-following"
                onClick={() => updateFollowList(true)}
              >
                <span>Following</span>
                <span className="follow-count">{followCount ?? 0}</span>
              </button>
              {owner && (
                <button className="edit-btn">
                  <SquarePen size={16} />
                  Edit
                </button>
              )}
            </div>
          </div>
          <div className="business_registration-container">
            {/*Use displayBusinesses everywhere */}
            {displayBusinesses.length > 0 ? (
              displayBusinesses.map((business) => (
                <div
                  className="business-rich"
                  key={business._id}
                  onClick={() => {
                    dispatch(pushNav(`/profile/${user?.id}`));
                    navigate(`/business/${business._id}`);
                  }}
                >
                  {/* Your perfect business card JSX stays the same */}
                  <div className="business-img-wrapper">
                    <img
                      src={business.profile || businessPlaceHolder}
                      alt={business.businessName}
                      className="business-rich-img"
                    />
                  </div>
                  <div className="business-rich-info">
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
                    <p className="business-rich-desc">
                      {business.description.length <= 50 ? (
                        business.description
                      ) : (
                        <>
                          {business.description.slice(0, 50)}…
                          <span className="read-more"> more</span>
                        </>
                      )}
                    </p>
                    <div className="business-rich-meta">
                      <span>
                        <MapPin size={16} />
                        {business.location.area}, {business.location.city},{" "}
                        {business.location.state}
                      </span>
                      <span>
                        <Phone size={16} />
                        {business.phoneNo?.[0]?.phone?.countryCode}{" "}
                        {business.phoneNo?.[0]?.phone?.number}
                      </span>
                    </div>
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
            ) : displayBusinesses.length === 0 && !loading ? (
              <div
                className="business-not-registered-container"
                onClick={() => navigate("/register-business")}
              >
                <span>not yet registered Business</span>
                {owner && <div></div>}
              </div>
            ) : (
              <div className="review-loader">
                <LoaderCircle className="animate-spin" color="black" />
              </div>
            )}

            {/*Use displayBusinesses here too */}
            {displayBusinesses.length > 0 && owner ? (
              <div className="profile-register-more-btn-container">
                <button
                  className="profile-register-more-btn"
                  onClick={() => navigate("/register-business")}
                >
                  <Store />
                  register business
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <FollowList
        visibility={showFollowList}
        updateVisibility={updateFollowList}
        id={user?.id}
        updateFollowCount={updateFollowCount}
        owner={owner}
      />
    </>
  );
};


export default Profile;
