import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useGet from "./../../../hooks/useGet";
import useDelete from "./../../../hooks/useDelete";
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
  TriangleAlert,
  UserRoundCheck,
  Clock,
  LocateFixed,
  ChartNoAxesColumn,
  Pencil,
  Trash,
  LoaderCircle,
} from "lucide-react";

//^leaflet imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import offerBanner from "./../../../assets/offerBanner.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import businessNotFound from "./../../../assets/businessNoFound.png";
import getUserFriendlyMessage from "../../../utils/userFriendlyErrors";

import Switch from "@mui/material/Switch";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

import toast from "react-hot-toast";

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
      {error ? (
        <div className="broken-link-container">
          <div>
            <img src={businessNotFound} alt="business not found" />
          </div>
          <div>
            <div className="error-lucide">
              <TriangleAlert />
            </div>
            {getUserFriendlyMessage(error)}
          </div>
        </div>
      ) : (
        <main className="business-profile-main">
          {owned && businessInfo.profileCompletion < 100 && (
            <div className="notify-business-profile-completion">
              <div className="information-complete">
                <div className="info-header">
                  <AlertCircle size={20} />
                  <h4>Complete your business profile</h4>
                </div>

                <p>
                  Your profile is{" "}
                  <strong>{businessInfo.profileCompletion}%</strong> complete.
                  Add the remaining details to improve visibility, build trust,
                  and help customers understand your business better.
                </p>

                <button className="complete-profile-btn">
                  Complete profile
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
          <section className="business-info-container">
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
                    {businessInfo?.description.length > 150 &&
                    !descVisibility ? (
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
          </section>
          <InfoBlock2 businessInfo={businessInfo} />
          <MediaBlock media={businessInfo?.media ?? []} theme={pageState} />
          <OfferSection businessInfo={businessInfo} theme={pageState} />
        </main>
      )}
    </>
  );
};

function InfoBlock2({ businessInfo }) {
  function RecenterButton({ position }) {
    const map = useMap();

    return (
      <button
        className="recenter-btn"
        onClick={() => map.setView(position, 13)}
        title="Back to business location"
      >
        <LocateFixed size={18} />
      </button>
    );
  }

  const { data } = useGet(
    businessInfo ? `follow/count?businessID=${businessInfo._id}` : null
  );

  const [isOpen, setIsOpen] = useState(false);

  const position = businessInfo?.location?.coordinates?.coordinates
    ? [
        businessInfo.location.coordinates.coordinates[0],
        businessInfo.location.coordinates.coordinates[1],
      ]
    : [12.9716, 77.5946]; // Bangalore fallback

  const navigate = useNavigate();

  return (
    <section className="business-section2-profile-info">
      <div>
        <div className="followers-container">
          <h2>
            <UserRoundCheck className="lucide-icon block2-icons" />
            Followers
          </h2>

          <h5>{data?.data?.count ?? 0}</h5>

          <button
            className="analytics-btn"
            title="View business analytics"
            onClick={() => navigate(`/business/${businessInfo._id}/analytics`)}
          >
            <ChartNoAxesColumn className="lucide-icon block2-icons" />
            <span>Analytics</span>
          </button>
        </div>

        <div className="working-hours">
          <div>
            <h2>
              <Clock className="lucide-icon block2-icons" />
              Working Hours{" "}
              {!businessInfo?.workingHours && <span>(Default)</span>}
            </h2>

            <p>
              <strong>Weekdays:</strong>{" "}
              {businessInfo?.workingHours?.weekdays?.open &&
              businessInfo?.workingHours?.weekdays?.close
                ? `${businessInfo.workingHours.weekdays.open} - ${businessInfo.workingHours.weekdays.close}`
                : "9:00 AM - 6:00 PM"}
            </p>

            <p>
              <strong>Weekends:</strong>{" "}
              {businessInfo?.workingHours?.weekends?.open &&
              businessInfo?.workingHours?.weekends?.close
                ? `${businessInfo.workingHours.weekends.open} - ${businessInfo.workingHours.weekends.close}`
                : "Closed"}
            </p>
            <span
              className={`${
                businessInfo?.status === "open" ? "status-green" : "status-red"
              }`}
            >
              {businessInfo?.status ?? "closed"}
            </span>
            <Switch
              checked={isOpen}
              onChange={(e) => setIsOpen(e.target.checked)}
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": {
                  color: "#22c55e",
                },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                  backgroundColor: "#22c55e",
                },
              }}
            />
          </div>
        </div>

        <div className="map-container">
          <h2>
            <MapPin className="lucide-icon " />
            Business Location
          </h2>
          <div className="map-wrapper">
            <MapContainer
              key={position.join(",")}
              center={position}
              zoom={13}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>{businessInfo?.businessName}</Popup>
              </Marker>
              <RecenterButton position={position} />
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Box, Button } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import OfferForm from "./OfferForm";

function MediaBlock({ media, theme }) {
  return (
    <div className="business-media-wrapper">
      <div>
        <h1>Business Media</h1>
        <p>Photos and videos showcasing this business</p>
      </div>

      <div className="business-media-container">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",

            gap: 2,
            overflowX: "auto",
            py: 1,
            width: "100%",

            "&::-webkit-scrollbar": {
              height: 6,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: 10,
            },
          }}
        >
          {media.length === 0 && (
            <Box
              className="no-media-info"
              sx={{
                width: "100%",
                height: 200,
                borderRadius: 2,

                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1.2,

                backgroundColor: theme ? "#fcfafa" : "#111",
                border: theme
                  ? "1px dashed rgba(0,0,0,0.25)"
                  : "1px dashed rgba(255,255,255,0.25)",

                color: theme ? "#555" : "rgba(255,255,255,0.75)",
                textAlign: "center",
                padding: "10px",
              }}
            >
              <Box sx={{ fontSize: 16, fontWeight: 600 }}>
                No media uploaded yet
              </Box>

              <Box sx={{ fontSize: 14, maxWidth: 420 }}>
                Upload photos or videos to showcase your business.
              </Box>

              <Box sx={{ fontSize: 13 }}>
                Free account: up to <strong>3</strong> media · Paid account: up
                to <strong>5</strong> media
              </Box>
            </Box>
          )}
          {/* Media items */}
          {media.map((item) => (
            <Box
              key={item.id}
              sx={{
                position: "relative",
                minWidth: 220,
                height: 200,
                borderRadius: 2,
                overflow: "hidden",
                flexShrink: 0,
                backgroundColor: "#000",
                cursor: "pointer",
              }}
            >
              {item.type === "image" ? (
                <img
                  src={item.src}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <>
                  <video
                    src={item.src}
                    autoPlay
                    controls
                    playsInline
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </>
              )}
            </Box>
          ))}

          {/* Add Media box */}
          <Box
            className="add-media"
            sx={{
              minWidth: 220,
              height: 200,
              borderRadius: 2,
              flexShrink: 0,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,

              backgroundColor: theme ? "#fcfafa" : "#111",
              border: theme
                ? "1px dashed rgba(0,0,0,0.25)"
                : "1px dashed rgba(255,255,255,0.25)",

              color: theme ? "#444" : "rgba(255,255,255,0.7)",
              cursor: "pointer",
              transition: "all 0.25s ease",

              "&:hover": {
                backgroundColor: theme ? "#f2f2f2" : "#1a1a1a",
                color: theme ? "#111" : "#fff",
              },
            }}
          >
            <AddPhotoAlternateOutlinedIcon
              sx={{
                fontSize: 42,
                color: "inherit",
              }}
            />

            <Box
              sx={{
                fontSize: 14,
                fontWeight: 500,
                color: "inherit",
              }}
            >
              Add media
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  );
}

function OfferSection({ businessInfo, theme }) {
  const [offers, setOffers] = useState([]);
  const { data, loading, error } = useGet(
    businessInfo ? `business/${businessInfo._id}/offers` : null
  );

  useEffect(() => {
    if (data) {
      setOffers(data.data);
    }
  }, [data]);

  const [displayForm, setDisplayForm] = useState(false);
  const [initialState, setInitialState] = useState({});

  const AddOffer = () => {
    return (
      <Box
        onClick={() => {
          const currentScrollY = window.scrollY;
          const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;
          const remainingHeight = docHeight - currentScrollY;
          const additionalScrollY = (120 / 100) * remainingHeight;
          window.scrollTo({
            top: currentScrollY + additionalScrollY,
            behavior: "smooth",
          });
          setDisplayForm(true);
        }}

        className="add-offer-btn"
        sx={{
          minWidth: 260,
          height: "100%",
          borderRadius: 2,
          flexShrink: 0,

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,

          backgroundColor: theme ? "#fcfafa" : "#111",
          border: theme
            ? "1px dashed rgba(0,0,0,0.25)"
            : "1px dashed rgba(255,255,255,0.25)",

          color: theme ? "#444" : "rgba(255,255,255,0.7)",
          cursor: "pointer",
          transition: "all 0.25s ease",

          "&:hover": {
            backgroundColor: theme ? "#f2f2f2" : "#1a1a1a",
            color: theme ? "#111" : "#fff",
          },
        }}
      >
        <AddCircleOutlineRoundedIcon
          sx={{
            fontSize: 42,
            color: "inherit",
          }}
        />

        <Box
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: "inherit",
          }}
        >
          Add Offer
        </Box>
      </Box>
    );
  };

  return (
    <>
      <section className="offer-section">
        <div className="offer-header">
          <h2>Offers</h2>
          <p>Current ongoing and upcoming offers</p>
        </div>
        {offers?.length !== 0 ? (
          <div className="offer-wrapper">
            <div className="offer-grid">
              {offers.map((offer, index) => (
                <OfferCard
                  key={index}
                  offer={offer}
                  businessID={businessInfo?._id}
                  offerState={[offers, setOffers]}
                  setInitialState={setInitialState}
                  displayForm={setDisplayForm}
                />
              ))}

              <AddOffer />
            </div>
          </div>
        ) : (
          <div className="no-offer-placeholder">
            <div>
              <Box
                className="no-media-info"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.2,
                  backgroundColor: theme ? "#fcfafa" : "#111",
                  border: theme
                    ? "1px dashed rgba(0,0,0,0.25)"
                    : "1px dashed rgba(255,255,255,0.25)",
                  color: theme ? "#555" : "rgba(255,255,255,0.75)",
                  textAlign: "center",
                  padding: "10px",
                }}
              >
                <Box sx={{ fontSize: 16, fontWeight: 600 }}>
                  No offers created yet
                </Box>

                <Box sx={{ fontSize: 14, maxWidth: 420 }}>
                  Create special offers to attract more customers to your
                  business.
                </Box>

                <Box sx={{ fontSize: 13 }}>
                  Free account: up to <strong>3</strong> offers · Paid account:
                  up to <strong>5</strong> offers
                </Box>
              </Box>
            </div>
            <AddOffer />
          </div>
        )}

        {displayForm && businessInfo?._id && (
          <OfferForm
            displayForm={setDisplayForm}
            businessID={businessInfo?._id}
            offers={[offers, setOffers]}
            initialState={initialState}
            clearInitialState={setInitialState}
          />
        )}
      </section>
    </>
  );
}

function OfferCard({ offer, businessID, offerState, setInitialState,displayForm }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { deleteData, responseData, error, loading } = useDelete();

  const handleDelete = async () => {
    if (confirmDelete && confirmText === offer.offerName) {
      try {
        await deleteData(`business/${businessID}/offers/${offer._id}`);

        const updatedOffers = offerState[0].filter(
          ({ _id }) => _id !== offer._id
        );
        offerState[1](updatedOffers);

        toast.success("Offer deleted successfully! 🎉");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong, please try again."
        );
      } finally {
        setConfirmDelete(false);
        setConfirmText("");
      }
    }
  };

  const now = new Date();
  const start = new Date(offer.startingDate);
  const end = new Date(offer.endingDate);

  const status = now < start ? "upcoming" : now <= end ? "live" : "";
  const isExpired = now > end;

  // Hide expired offers completely
  if (isExpired) {
    return null;
  }

  return (
    <div className="offer-card">
      {confirmDelete ? (
        /* DELETE CONFIRM VIEW */
        <div className="offer-delete-confirm">
          <p>
            Type <strong>{offer.offerName}</strong> to confirm deletion
          </p>

          <input
            type="text"
            className="confirm-input"
            placeholder="Enter offer name"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
          />

          <div className="confirm-actions">
            <button
              className="confirm-delete flex items-center justify-center"
              disabled={confirmText !== offer.offerName || loading}
              onClick={handleDelete}
            >
              {loading ? (
                <LoaderCircle className="animate-spin mx-auto" color="white" />
              ) : (
                "Delete"
              )}
            </button>

            <button
              className="confirm-cancel"
              onClick={() => {
                setConfirmDelete(false);
                setConfirmText("");
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        /* NORMAL OFFER CARD */
        <>
          <div className="offer-image">
            <img src={offer.image ?? offerBanner} alt={offer.offerName} />

            <span className="offer-badge">
              {offer?.discount?.type === "percentage"
                ? `${offer?.discount?.value}% OFF`
                : `₹${offer?.discount?.value} OFF`}
            </span>

            <button
              className="edit-offer"
              disabled={loading}
              onClick={() => {
                setInitialState(offer);
                displayForm(true);
              }}
            >
              <Pencil size={16} />
            </button>

            <button
              className="delete-offer"
              onClick={() => setConfirmDelete(true)}
              disabled={loading}
            >
              <Trash size={16} />
            </button>
          </div>

          <div className="offer-content">
            <h3 className="offer-title">
              {offer.offerName}
              {status && (
                <span className={`offer-status ${status}`}>
                  {status === "live" ? "LIVE" : "UPCOMING"}
                </span>
              )}
            </h3>

            <p className="offer-description">{offer.description}</p>

            <div className="offer-dates">
              <span>{start.toDateString()}</span>
              <span> → </span>
              <span>{end.toDateString()}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BusinessProfile;
