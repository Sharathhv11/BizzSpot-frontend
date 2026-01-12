import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useGet from "./../../../hooks/useGet";
import Nav2 from "../Util/Nav2";
import "./businessProfile.css";
import businessNoProfile from "./../../../assets/businessPlaceHolder.png";
import {
  AlertCircle,
  ArrowRight,
  Store,
  FileText,
  MapPin,
  Phone,
  Star,
  Pen,
  TriangleAlert
} from "lucide-react";

import businessNotFound from "./../../../assets/businessNoFound.png"
import getUserFriendlyMessage from "../../../utils/userFriendlyErrors";

import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

const BusinessProfile = () => {
  const { businessID } = useParams();
  const [owned, setOwned] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [descVisibility, setDescVisibility] = useState(false);
  const navigate = useNavigate();

  //^verify that businessID is exists in redux state
  const userOwnedBusiness = useSelector((state) => state.user.usersBusiness);

  //* accessing the page information
  const user = useSelector((state) => state.user.userInfo);
  const pageState = useSelector((state) => state.pageState.theme);

  //!if user doesn't exists redirect him for "/"
  if (!user) {
    return <Navigate to="/" replace />;
  }

  //^ensuring weather business present in the userOwnedBusiness
  useEffect(() => {
    if (!userOwnedBusiness || !businessID) return;

    const ownedBusiness = userOwnedBusiness.find(
      ({ _id, owner }) => _id === businessID && owner?._id === user?.id
    );

    if (ownedBusiness) {
      setOwned(true);
      setBusinessInfo(ownedBusiness);
    } else {
      setOwned(false);
    }
  }, [userOwnedBusiness, businessID, user?.id]);

  const { data, loading, error } = useGet(
    !businessInfo ? `business/${businessID}` : null
  );

  useEffect(() => {
    if (data?.data) {
      if (data?.data?.owner === user?.id) setOwned(true);
      setBusinessInfo(data?.data);
    }
  }, [data]);


  

  return (
    <>
      <Nav2 pageState={pageState} user={user} redirect={"/profile"} />
      {error?
      <div className="broken-link-container">
        <div>
           <img src={businessNotFound} alt="business not found" />
        </div>
          <div><div className="error-lucide"><TriangleAlert/></div>{getUserFriendlyMessage(error)}</div>
      </div>
      :<main className="business-profile-main">
        {owned && businessInfo.profileCompletion < 100 && (
          <div className="notify-business-profile-completion">
            <div className="information-complete">
              <div className="info-header">
                <AlertCircle size={20} />
                <h4>Complete your business profile</h4>
              </div>

              <p>
                Your profile is{" "}
                <strong>{businessInfo.profileCompletion}%</strong> complete. Add
                the remaining details to improve visibility, build trust, and
                help customers understand your business better.
              </p>

              <button className="complete-profile-btn">
                Complete profile
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
        <div className="business-info-container">
          <div className="business-profile-info-container">
            <div className="business-profile-image-container">
              <img
                src={businessInfo?.profile || businessNoProfile}
                alt={businessInfo?.name}
              />
            </div>
            <div className="business-details-container">
              <div className="name-container">
                {businessInfo ? (
                  <>
                    <span>
                      <Store className="lucide-icon" />
                      {businessInfo.businessName}
                    </span>
                    <span>{businessInfo.email}</span>{" "}
                  </>
                ) : (
                  <div></div>
                )}
              </div>
              <div className="description-container">
                <span>
                  <FileText className="lucide-icon" />
                  Description
                </span>
                <span className="information">
                  {businessInfo?.description.length > 150 && !descVisibility ? (
                    <>
                      {businessInfo?.description.slice(0, 150)}
                      <button
                        className="more"
                        onClick={() => {
                          setDescVisibility(true);
                        }}
                      >
                        ...more
                      </button>
                    </>
                  ) : (
                    <>
                      {businessInfo?.description}
                      <button
                        className={`more ${
                          businessInfo?.description.length > 150
                            ? null
                            : "hidden"
                        }`}
                        onClick={() => {
                          setDescVisibility(false);
                        }}
                      >
                        less
                      </button>
                    </>
                  )}
                </span>
              </div>
              <div className="location-container">
                <span>
                  <MapPin className="lucide-icon" />
                  location
                </span>
                <span className="information location-text">
                  {[
                    businessInfo?.location?.area,
                    businessInfo?.location?.city,
                    businessInfo?.location?.district,
                    businessInfo?.location?.state,
                    businessInfo?.location?.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  {businessInfo?.location?.pincode && (
                    <span className="pincode">
                      {" "}
                      ({businessInfo.location.pincode})
                    </span>
                  )}
                </span>
              </div>
              <div className="number-container">
                <span>
                  <Phone className="lucide-icon" />
                  Phone
                </span>
                <span className="information">
                  {businessInfo?.phoneNo[0]?.phone.countryCode +
                    " " +
                    businessInfo?.phoneNo[0]?.phone.number}
                </span>
              </div>
              <div className="rating-container">
                <span>
                  <Star className="lucide-icon" />
                  Rating
                </span>
                <span>
                  <Stack spacing={1}>
                    <Rating
                      name="half-rating-read"
                      value={
                        businessInfo?.rating?.sumOfReview /
                        businessInfo?.rating?.totalReview
                      }
                      precision={0.5}
                      readOnly
                    />
                  </Stack>
                  <span className="review-count">
                    ({businessInfo?.rating?.totalReview} reviews)
                  </span>
                </span>
              </div>
            </div>
            <button className="update-profile">
              <Pen size={16} />
              Edit profile
            </button>
          </div>
        </div>
      </main>}
    </>
  );
};

export default BusinessProfile;
