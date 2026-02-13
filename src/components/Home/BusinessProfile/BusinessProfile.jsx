import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
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

import Follow from "../Util/Follow";

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
import Tweet from "./Tweet";
import FollowList from "../Util/FollowList";

const BusinessProfile = () => {
  const { businessID } = useParams();
  const [owned, setOwned] = useState(false);
  const [businessInfo, setBusinessInfo] = useState(null);
  const [descVisibility, setDescVisibility] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [fetchUsersBusiness, setFetchUsersBusiness] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectUserID = useSelector((state) => state.pageState.redirectUserID);

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

    const ownedBusiness = userOwnedBusiness.find(({ _id, owner }) => {
      const ownerId = typeof owner === "string" ? owner : owner?._id;

      return _id === businessID && ownerId === user?.id;
    });

    if (ownedBusiness) {
      setOwned(true);
      setBusinessInfo(ownedBusiness);
    } else {
      setOwned(false);
      setShouldFetch(true);
    }
  }, [userOwnedBusiness, businessID, user?.id]);

  const { data, loading, error } = useGet(
    shouldFetch ? `business/${businessID}` : null,
  );

  const { data: businessList } = useGet(
    fetchUsersBusiness ? `business/owned?ownedBy=${user?.id}` : null,
  );

  useEffect(()=>{
    if(businessList?.data )
    {
      dispatch(setUserBusiness(businessList?.data));
    }
  },[businessList])

  useEffect(() => {
    if (data?.data) {
      if (data?.data?.owner?._id === user?.id) {
        setFetchUsersBusiness(true);
        setOwned(true);
      }
      setBusinessInfo(data?.data);
    }
  }, [data]);

  return (
    <>
      <Nav2
        pageState={pageState}
        user={user}
        redirect={redirectUserID ? `/profile/${redirectUserID}` : null}
      />
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
                {businessInfo?.categories && (
                  <div className="business-category-container">
                    {businessInfo.categories.map((e) => {
                      return <span className="business-category">{e}</span>;
                    })}
                  </div>
                )}
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
                {(businessInfo?.socialLinks?.facebook ||
                  businessInfo?.socialLinks?.instagram ||
                  businessInfo?.socialLinks?.twitter ||
                  businessInfo?.socialLinks?.website) && (
                  <div className="business-page-socialLinks-container">
                    {businessInfo?.socialLinks?.facebook && (
                      <a
                        href={businessInfo.socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Facebook />
                      </a>
                    )}

                    {businessInfo?.socialLinks?.instagram && (
                      <a
                        href={businessInfo.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Instagram />
                      </a>
                    )}

                    {businessInfo?.socialLinks?.twitter && (
                      <a
                        href={businessInfo.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Twitter />
                      </a>
                    )}

                    {businessInfo?.socialLinks?.website && (
                      <a
                        href={businessInfo.socialLinks.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <WebStories />
                      </a>
                    )}
                  </div>
                )}
              </div>
              {owned ? (
                <button
                  className="update-profile"
                  onClick={() => {
                    navigate(`/Update-Business/${businessInfo?._id}`);
                  }}
                >
                  <Pen size={16} />
                  Edit profile
                </button>
              ) : (
                businessInfo?.owner && (
                  <div className="owner-mini">
                    <img
                      src={businessInfo.owner.profilePicture}
                      alt={businessInfo.owner.username}
                      className="owner-mini-avatar"
                    />

                    <div className="owner-mini-text">
                      <span className="owner-mini-name">
                        {businessInfo.owner.username}
                      </span>
                      <span className="owner-mini-email">
                        {businessInfo.owner.email}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
          <InfoBlock2 businessInfo={businessInfo} owned={owned} />
          <MediaBlock
            media={businessInfo?.media ?? []}
            theme={pageState}
            owned={owned}
            businessID={businessInfo?._id}
            business={businessInfo}
          />
          <OfferSection
            businessInfo={businessInfo}
            theme={pageState}
            owned={owned}
          />
          <Review userInfo={user} businessInfo={businessInfo} owned={owned} />
          <Tweet owned={owned} businessInfo={businessInfo} />
          {owned && <DeleteBusiness business={businessInfo} />}
        </main>
      )}
    </>
  );
};

function InfoBlock2({ businessInfo, owned }) {
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

  const dispatch = useDispatch();

  const { data } = useGet(
    businessInfo ? `follow/count?businessID=${businessInfo._id}` : null,
  );

  const { data: followStatus } = useGet(
    businessInfo && !owned
      ? `business/${businessInfo?._id}/follow-status`
      : null,
  );
  const [isOpen, setIsOpen] = useState(businessInfo?.status === "Open");
  const [disableSlider, setDisableSlider] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const { patchData } = usePatch();

  const position = businessInfo?.location?.coordinates?.coordinates
    ? [
        businessInfo.location.coordinates.coordinates[0],
        businessInfo.location.coordinates.coordinates[1],
      ]
    : [12.9716, 77.5946]; // Bangalore fallback

  useEffect(() => {
    if (data) {
      setFollowersCount(data?.data?.count);
    }
  }, [data]);

  const navigate = useNavigate();

  const [visibility, updateVisibility] = useState(false);
  const { usersBusiness } = useSelector((state) => state.user);

  const handleStatusChange = async function () {
    try {
      setDisableSlider(true);
      setIsOpen((prev) => !prev);
      const serverResponse = await patchData(`/business/${businessInfo?._id}`, {
        status: isOpen ? "Closed" : "Open",
      });

      const updatedData = usersBusiness.map((e) => {
        if (e._id === businessInfo?._id) return serverResponse.data;
        else return e;
      });
      dispatch(setUserBusiness(updatedData));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, please try again.",
      );
    } finally {
      setDisableSlider(false);
    }
  };

  return (
    <>
      <FollowList
        visibility={visibility}
        updateVisibility={updateVisibility}
        updateFollowCount={setFollowersCount}
        id={businessInfo?._id}
        owner={false}
        businessList={owned}
      />
      <section className="business-section2-profile-info">
        <div>
          <div className="followers-container">
            <h2>
              <UserRoundCheck className="lucide-icon block2-icons" />
              Followers
            </h2>

            <h5
              className="cursor-pointer"
              onClick={() => updateVisibility(true)}
            >
              {followersCount ?? 0}
            </h5>
            {owned ? (
              <button
                className="analytics-btn"
                title="View business analytics"
                onClick={() =>
                  navigate(`/business/${businessInfo._id}/analytics`)
                }
              >
                <ChartNoAxesColumn className="lucide-icon block2-icons" />
                <span>Analytics</span>
              </button>
            ) : (
              <Follow
                businessID={businessInfo?._id}
                status={followStatus?.data.followingStatus}
                updateFollowersCount={setFollowersCount}
              />
            )}
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
                  businessInfo?.status === "Open"
                    ? "status-green"
                    : "status-red"
                }`}
              >
                {businessInfo?.status ?? "closed"}
              </span>
              {owned && (
                <Switch
                  disabled={disableSlider}
                  checked={isOpen}
                  onChange={handleStatusChange}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": {
                      color: "#22c55e",
                    },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: "#22c55e",
                    },
                  }}
                />
              )}
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
    </>
  );
}

import { Box, Button, Modal, Typography } from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import OfferForm from "./OfferForm";
import Review from "./Review";
import DeleteBusiness from "./DeleteBusiness";
import { Facebook, Instagram, Twitter, WebStories } from "@mui/icons-material";
import usePost from "@/hooks/usePost";
import { setUserBusiness } from "@/redux/reducers/user";
import usePatch from "@/hooks/usePatch";

function MediaBlock({ media, theme, owned, business }) {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { usersBusiness } = useSelector((state) => state.user);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const withPreview = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
    }));

    setSelectedFiles((prev) => [...prev, ...withPreview]);
  };

  const { postData, loading } = usePost();
  const { deleteData } = useDelete();

  const handleSubmit = async () => {
    if (!selectedFiles.length) return;

    try {
      const formData = new FormData();

      selectedFiles.forEach((item) => {
        formData.append("media", item.file);
      });

      const serverResponse = await postData(
        `/business/${business._id}/media`,
        formData,
        {
          "Content-Type": "multipart/form-data",
        },
      );
      const updatedData = usersBusiness.map((e) => {
        if (e._id === serverResponse.data._id) return serverResponse.data;
        else return e;
      });
      dispatch(setUserBusiness(updatedData));
      setOpen(false);
      setSelectedFiles([]);

      toast.success("media uploaded successfully.");
    } catch (error) {
      const status = error?.status;
      const code = error?.response?.data?.code;
      const message =
        error?.response?.data?.message ||
        "Something went wrong, please try again.";

      if (status === 403 && code === "SUBSCRIPTION_REQUIRED") {
        toast.error(message);
        navigate("/payment");
        return;
      }

      if (status === 403 && code === "PREMIUM_LIMIT_REACHED") {
        toast.error(message);
        return;
      }

      toast.error(message);
    }
  };

  const handleCancel = () => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.preview));
    setSelectedFiles([]);
    setOpen(false);
  };

  function mediaType(url) {
    if (!url || typeof url !== "string") return "unknown";

    // remove query params if any
    const cleanUrl = url.split("?")[0];

    // extract extension
    const ext = cleanUrl.split(".").pop().toLowerCase();

    const imageExt = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
    const videoExt = ["mp4", "webm", "mov", "avi", "mkv"];

    if (imageExt.includes(ext)) {
      return "image";
    }
    if (videoExt.includes(ext)) return "video";

    return "unknown";
  }

  async function deleteMedia(url) {
    if (!url) return;
    const encodedUrl = encodeURIComponent(url);

    try {
      await deleteData(`business/${business._id}/media/${encodedUrl}`);
      toast.success("successfully deleted media.");
      const updatedData = usersBusiness.map((e) => {
        if (e._id === business._id)
          return {
            ...business,
            media: business.media.filter((u) => u !== url),
          };
        else return e;
      });
      dispatch(setUserBusiness(updatedData));
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, please try again.",
      );
    }
  }

  return (
    <div className="business-media-wrapper">
      <div>
        <h1>Business Media</h1>
        <p>Photos and videos showcasing this business</p>
      </div>

      <div className="business-media-container">
        <Box sx={{ display: "flex", gap: 2, overflowX: "auto", py: 1 }}>
          {/* EMPTY STATE */}
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

          {/* MEDIA ITEMS */}
          {media.map((item) => (
            <Box
              key={item}
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
              {owned && (
                <button
                  className="delete-media"
                  title="delete media"
                  onClick={() => {
                    deleteMedia(item);
                  }}
                >
                  <Trash />
                </button>
              )}
              {mediaType(item) === "image" ? (
                <img
                  src={item}
                  alt=""
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <video
                  src={item}
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
              )}
            </Box>
          ))}

          {/* ADD MEDIA */}
          {owned && (
            <Box
              onClick={() => setOpen(true)}
              sx={{
                minWidth: 220,
                height: 200,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                border: "1px dashed #aaa",
                cursor: "pointer",
              }}
            >
              <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 42 }} />
              <Typography>Add media</Typography>
            </Box>
          )}
        </Box>
      </div>

      {/* upload modal */}
      <Modal open={open} onClose={handleCancel}>
        <Box
          sx={{
            width: {
              xs: "92%", // mobile
              sm: 520, // desktop
            },
            maxHeight: "90vh",
            overflow: "hidden",
            bgcolor: "#fff",
            color: "#000",
            borderRadius: 3,
            mx: "auto",
            mt: {
              xs: "8vh",
              sm: "5vh",
            },
            display: "flex",
            flexDirection: "column",
            boxShadow: 24,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              pt: 3,
              pb: 1,
              textAlign: "center",
              borderBottom: "1px solid #eee",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Upload Media
            </Typography>
          </Box>

          {/* Body scroll area */}
          <Box
            sx={{
              px: 3,
              py: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {/* Choose files button */}
            <Button
              component="label"
              sx={{
                border: "1px dashed #ddd",
                borderRadius: 2,
                py: 1.2,
                fontWeight: 500,
                textTransform: "none",
                backgroundColor: "#fafafa",

                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              Choose files
              <input
                hidden
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileChange}
              />
            </Button>

            {/* Preview grid */}
            {selectedFiles.length > 0 && (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(auto-fill, minmax(90px, 1fr))",
                    sm: "repeat(auto-fill, 120px)",
                  },
                  gap: 1.5,
                  p: 1.5,
                  borderRadius: 2,
                  backgroundColor: "#f7f7f7",
                }}
              >
                {selectedFiles.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: "100%",
                      aspectRatio: "1 / 1",
                      borderRadius: 2,
                      overflow: "hidden",
                      backgroundColor: "#000",
                    }}
                  >
                    {item.type === "image" ? (
                      <img
                        src={item.preview}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <video
                        src={item.preview}
                        muted
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          {/* Footer actions */}
          <Box
            sx={{
              px: 3,
              py: 2,
              borderTop: "1px solid #eee",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              onClick={handleCancel}
              sx={{
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={!selectedFiles.length}
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: 2,
                textTransform: "none",

                "&:hover": {
                  backgroundColor: "#222",
                },

                "&.Mui-disabled": {
                  backgroundColor: "#ccc",
                  color: "#777",
                },
              }}
            >
              {loading ? (
                <LoaderCircle className="animate-spin mx-auto" />
              ) : (
                "Upload"
              )}
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

function OfferSection({ businessInfo, theme, owned }) {
  const [offers, setOffers] = useState([]);
  const { data, loading, error } = useGet(
    businessInfo ? `business/${businessInfo._id}/offers` : null,
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
      <>
        {owned && (
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
        )}
      </>
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
                  owned={owned}
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

function OfferCard({
  offer,
  businessID,
  offerState,
  setInitialState,
  displayForm,
  owned,
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { deleteData, responseData, error, loading } = useDelete();

  const handleDelete = async () => {
    if (confirmDelete && confirmText === offer.offerName) {
      try {
        await deleteData(`business/${businessID}/offers/${offer._id}`);

        const updatedOffers = offerState[0].filter(
          ({ _id }) => _id !== offer._id,
        );
        offerState[1](updatedOffers);

        toast.success("Offer deleted successfully! 🎉");
      } catch (error) {
        toast.error(
          error?.response?.data?.message ||
            "Something went wrong, please try again.",
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

            {owned && (
              <>
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
              </>
            )}
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
