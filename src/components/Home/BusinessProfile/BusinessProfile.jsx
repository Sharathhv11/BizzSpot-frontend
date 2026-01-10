import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useGet from "./../../../hooks/useGet";
import Nav2 from "../Util/Nav2";
import "./businessProfile.css";

const BusinessProfile = () => {
  const { businessID } = useParams();
  const [owned, setOwned] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);
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
    if (data) setBusinessInfo(data?.data);
  }, [data]);

  return (
    <>
      <Nav2 pageState={pageState} user={user} />
      <main className="business-profile-main">
        <div className="business-info-container">
          <div className="business-profile-info-container">
            <div className="business-profile-image-container">
              {/* <img src={} alt={} /> */}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BusinessProfile;
