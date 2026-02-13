import { useState, useEffect, useRef } from "react";
import "./styles/updateBusiness.css";

import {
  Pencil,
  Phone,
  Mail,
  Building,
  CircleX,
  LoaderCircle,
  Globe,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

import usePatch from "../../../hooks/usePatch";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Nav2 from "../Util/Nav2";
import noBusinessBanner from "../../../assets/businessNoFound.png";
import { useDispatch, useSelector } from "react-redux";
import { setUserBusiness } from "@/redux/reducers/user";

/* ================= MAP HELPERS ================= */

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) map.setView(position);
  }, [position, map]);

  return null;
};

const ClickToMoveMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

/* ================= COMPONENT ================= */

const UpdateBusiness = () => {
  const { userInfo, usersBusiness } = useSelector((s) => s.user);

  if (!userInfo) return <Navigate to="/" />;

  const dispatch = useDispatch();

  const { businessID } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();

  const { patchData, loading } = usePatch();

  const [business, setBusiness] = useState(null);
  const [mediaPreview, setMediaPreview] = useState("");

  const [position, setPosition] = useState([20.5937, 78.9629]);

  const [formData, setFormData] = useState({
    businessName: "",
    description: "",
    email: "",
    phoneNo: "",
    categories: [],
  });

  const [errors, setErrors] = useState({});

  /* ---------- CATEGORY STATE ---------- */

  const [showAllCategories, setShowAllCategories] = useState(false);

  const categoriesList = [
    "Clothing Store",
    "Electronics",
    "Mobile Store",
    "Furniture",
    "Jewellery",
    "Home Appliances",
    "Supermarket",
    "Grocery Store",
    "Footwear",
    "Cosmetics",
    "Restaurant",
    "Cafe",
    "Bakery",
    "Fast Food",
    "Catering Service",
    "Hotel",
    "Resort",
    "Salon",
    "Spa",
    "Car Repair",
    "Bike Repair",
    "Plumber",
    "Electrician",
    "House Cleaning",
    "Pest Control",
    "Laundry Service",
    "Internet Service",
    "Printing Service",
    "School",
    "College",
    "Coaching Centre",
    "Tuition Centre",
    "Training Institute",
    "Computer Institute",
    "Hospital",
    "Clinic",
    "Pharmacy",
    "Diagnostic Lab",
    "Fitness Centre",
    "Yoga Studio",
    "Cricket Club",
    "Gaming Zone",
    "Playground",
    "Cinema",
    "Mall",
    "Real Estate",
    "Finance",
    "Insurance",
    "Consulting",
    "IT Services",
    "Marketing Agency",
    "Event Management",
    "Photography Service",
  ];

  const visibleCategories = showAllCategories
    ? categoriesList
    : categoriesList.slice(0, 4);

  /* ---------- SOCIAL STATE ---------- */

  const [socialLinks, setSocialLinks] = useState({
    website: "",
    facebook: "",
    instagram: "",
    twitter: "",
  });

  const [socialModal, setSocialModal] = useState(null);
  const [socialInput, setSocialInput] = useState("");

  /* ================= LOAD BUSINESS ================= */

  useEffect(() => {
    if (!usersBusiness?.length ) return;

    
    const found = usersBusiness.find((b) => b?._id === businessID);
    if (!found) return;

    setBusiness(found);

    setFormData({
      businessName: found.businessName ?? "",
      description: found.description ?? "",
      email: found.email ?? "",
      phoneNo: found.phoneNo?.[0]?.phone?.number ?? "",
      categories: found.categories ?? [],
    });

    setSocialLinks({
      website: found.socialLinks?.website ?? "",
      facebook: found.socialLinks?.facebook ?? "",
      instagram: found.socialLinks?.instagram ?? "",
      twitter: found.socialLinks?.twitter ?? "",
    });

    const coords = found.location?.coordinates?.coordinates;

    if (coords?.length === 2) setPosition(coords);

    setMediaPreview(found.profile ?? "");
  }, [usersBusiness, businessID]);

  /* ================= VALIDATION ================= */

  const validate = () => {
    const err = {};

    if (!formData.businessName.trim())
      err.businessName = "Business name required";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      err.email = "Invalid email";

    if (formData.phoneNo && !/^[6-9][0-9]{9}$/.test(formData.phoneNo))
      err.phoneNo = "Invalid phone";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  useEffect(() => {
    validate();
  }, [formData.businessName, formData.email, formData.phoneNo]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleMedia = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMediaPreview(URL.createObjectURL(file));
  };

  /* CATEGORY */

  const toggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);

      if (!exists && prev.categories.length >= 5) {
        toast.error("Maximum 5 categories allowed");
        return prev;
      }

      return {
        ...prev,
        categories: exists
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      };
    });
  };

  /* SOCIAL */

  const openSocial = (type) => {
    setSocialModal(type);
    setSocialInput(socialLinks[type] || "");
  };

  const updateSocial = () => {
    setSocialLinks((p) => ({
      ...p,
      [socialModal]: socialInput,
    }));
    setSocialModal(null);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = new FormData();

    payload.append("businessName", formData.businessName);
    payload.append("description", formData.description);
    payload.append("email", formData.email);

    payload.append("phoneNo[0][phone][countryCode]", "+91");
    payload.append("phoneNo[0][phone][number]", formData.phoneNo);

    formData.categories.forEach((c) => payload.append("categories", c));

    payload.append("socialLinks", JSON.stringify(socialLinks));

    payload.append("location[coordinates][type]", "Point");
    payload.append("location[coordinates][coordinates][0]", position[0]);
    payload.append("location[coordinates][coordinates][1]", position[1]);


    if (fileRef.current?.files.length) {
      payload.append("profile", fileRef.current.files[0]);
    }

    try {
      const serverResponse = await patchData(
        `/business/${business?._id}`,
        payload,
        {
           "Content-Type": "multipart/form-data",
        }
      );

      const updatedData = usersBusiness.map((e) => {
        if (e._id === serverResponse.data._id) return serverResponse.data;
        else return e;
      });
      navigate(`/business/${business._id}`);
      dispatch(setUserBusiness(updatedData));
      toast.success("Business updated!");
    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  const isValid = Object.keys(errors).length === 0;

  /* ================= UI ================= */

  return (
    <>
      <Nav2 />

      <section className="update-business">
        <div className="update-business-card">
          <h2>Edit Business</h2>

          {/* MEDIA */}
          <div className="update-business-media">
            <img src={mediaPreview || noBusinessBanner} />

            <input hidden type="file" ref={fileRef} onChange={handleMedia} />

            <button type="button" onClick={() => fileRef.current?.click()}>
              <Pencil size={14} />
            </button>
          </div>

          {/* BASIC FIELDS */}
          {[
            ["businessName", "Business Name", Building],
            ["email", "Email", Mail],
            ["phoneNo", "Phone", Phone],
          ].map(([key, label, Icon]) => (
            <div key={key} className="update-business-field">
              <label>{label}</label>

              <div className="update-business-input">
                <Icon size={16} />
                <input
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                />
              </div>

              {errors[key] && (
                <div className="Error">
                  <CircleX size={14} />
                  {errors[key]}
                </div>
              )}
            </div>
          ))}

          {/* DESCRIPTION */}
          <div className="update-business-field update-business-description">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          {/* CATEGORIES */}

          {/* MAP */}
          <h3>Business Location</h3>

          <div className="map-placeholder">
            <MapContainer
              center={position}
              zoom={13}
              scrollWheelZoom={false}
              className="map-container-user-profile"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              <RecenterMap position={position} />

              <ClickToMoveMarker setPosition={setPosition} />

              <Marker position={position}>
                <Popup>Click map to update location</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="location-readout">
            Lat: {position[0].toFixed(5)} | Lng: {position[1].toFixed(5)}
          </div>

          <h3 className="category-header">Categories (max 5)</h3>

          <div className="update-business-categories">
            {visibleCategories.map((cat) => {
              const selected = formData.categories.includes(cat);

              return (
                <button
                  key={cat}
                  type="button"
                  className={selected ? "selected" : ""}
                  onClick={() => toggleCategory(cat)}
                >
                  {cat}
                </button>
              );
            })}

            <button
              type="button"
              className="more"
              onClick={() => setShowAllCategories((p) => !p)}
            >
              {showAllCategories ? "− Less" : "+ More"}
            </button>
          </div>

          {/* SOCIAL LINKS */}
          <h3 className="social-links-header">Social Links</h3>

          <div className="social-icons">
            {[
              ["website", Globe],
              ["facebook", Facebook],
              ["instagram", Instagram],
              ["twitter", Twitter],
            ].map(([type, Icon]) => (
              <button
                key={type}
                type="button"
                className="social-btn"
                onClick={() => openSocial(type)}
              >
                <Icon size={18} />
              </button>
            ))}
          </div>

          {socialModal && (
            <div className="social-modal">
              <div className="social-box">
                <h4>Add {socialModal} link</h4>

                <input
                  value={socialInput}
                  onChange={(e) => setSocialInput(e.target.value)}
                />

                <div className="social-actions">
                  <button onClick={() => setSocialModal(null)}>Cancel</button>

                  <button onClick={updateSocial}>Save</button>
                </div>
              </div>
            </div>
          )}

          {/* SAVE */}
          <button
            className="update-business-save flex justify-center items-center"
            disabled={!isValid || loading}
            onClick={handleSubmit}
          >
            {loading ? <LoaderCircle className="spin" /> : "Save Business"}
          </button>
        </div>
      </section>
    </>
  );
};

export default UpdateBusiness;
