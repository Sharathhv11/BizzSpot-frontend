import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate,Navigate } from "react-router-dom";
import Nav2 from "./../Util/Nav2.jsx";
import "./business.css";
import { CircleX } from "lucide-react";
import { setUserBusiness } from "../../../redux/reducers/user";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import usePost from "../../../hooks/usePost.js";
import toast from "react-hot-toast";

//!LEAFLET MARKER FI/!*/
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

//!RECENTER MA/!*/
const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);

  return null;
};

//!CLICK TO MOVE MARKE/!*/
const ClickToMoveMarker = ({ setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    },
  });

  return null;
};

const BusinessRegistration = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const isLight = useSelector((state) => state.pageState.theme);
  let userOwedBusiness = useSelector((state) => state.user.usersBusiness);

  const dispatch = useDispatch();

  const { postData, responseData, error, loading } = usePost();
  const profileRef = useRef();

  const [position, setPosition] = useState([51.505, -0.09]);

  const [emailError, setEmailError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [submitError, setSubmitError] = useState();
  const [form, setForm] = useState({
    businessName: "",
    description: "",
    email: "",
    phone: "",
    location: {
      country: "",
      state: "",
      district: "",
      city: "",
      area: "",
      pincode: "",
    },
  });

  //^hook for checking and notifying the error in the business Mail id
  useEffect(() => {
    const emailValidator = setTimeout(() => {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (form.email && !emailPattern.test(form.email)) {
        setEmailError("Invalid email pattern");
      } else {
        setEmailError("");
      }

      const phoneNumberPattern = /^[6789][0-9]{9}$/;
      if (form.phone && !phoneNumberPattern.test(form.phone)) {
        setPhoneNumberError("Invalid Indian mobile number.");
      } else {
        setPhoneNumberError("");
      }

      const pinCodePattern = /^[1-9][0-9]{2}\s?[0-9]{3}$/;
      if (
        form.location.pincode &&
        !pinCodePattern.test(form.location.pincode)
      ) {
        setPincodeError("Invalid Indian Pincode.");
      } else {
        setPincodeError("");
      }
    }, 500);

    return () => clearTimeout(emailValidator);
  }, [form.email, form.phone, form.location.pincode]);

  /* Get user current location */
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  if (!user) {
   return <Navigate to="/" replace />;
  }

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      location: { ...p.location, [name]: value },
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //* Email
    if (emailError) return;
    if (!emailError && form.email.length === 0) {
      setSubmitError("Please provide the business email ID.");
      return;
    }

    //* Phone
    if (phoneNumberError) return;
    if (!phoneNumberError && !form.phone.length) {
      setSubmitError("Please provide the business phone number.");
      return;
    }

    //* Pincode
    if (pincodeError) return;
    if (!pincodeError && !form.location.pincode.length) {
      setSubmitError("Please provide the business pincode.");
      return;
    }

    //! MAJOR FIELDS
    if (!form.businessName.trim()) {
      setSubmitError("Please enter the business name.");
      return;
    }

    if (!form.description.trim()) {
      setSubmitError("Please add a short business description.");
      return;
    }

    if (!form.location.country.trim()) {
      setSubmitError("Please fill the country.");
      return;
    }

    if (!form.location.state.trim()) {
      setSubmitError("Please select the state.");
      return;
    }

    if (!form.location.district.trim()) {
      setSubmitError("Please enter the district.");
      return;
    }

    if (!form.location.city.trim()) {
      setSubmitError("Please enter the city.");
      return;
    }

    setSubmitError("");

    //  Add coordinates
    const updatedForm = {
      ...form,
      location: {
        ...form.location,
        coordinates: {
          type: "Point",
          coordinates: position, // [lng, lat]
        },
      },
    };

    const formData = new FormData();

    formData.append("businessName", form.businessName);
    formData.append("description", form.description);
    formData.append("email", form.email);

    // Location
    formData.append("location[country]", form.location.country);
    formData.append("location[state]", form.location.state);
    formData.append("location[district]", form.location.district);
    formData.append("location[city]", form.location.city);
    formData.append("location[area]", form.location.area);
    formData.append("location[pincode]", form.location.pincode);

    formData.append("location[coordinates][type]", "Point");
    formData.append("location[coordinates][coordinates][0]", position[0]);
    formData.append("location[coordinates][coordinates][1]", position[1]);

    // Phone array
    formData.append("phoneNo[0][phone][countryCode]", "+91");
    formData.append("phoneNo[0][phone][number]", form.phone);

    // File
    if (profileRef.current?.files?.[0]) {
      formData.append("profile", profileRef.current.files[0]);
    }

   

    try {
      const serverResponse = await postData("/business", formData, {
        "Content-Type": "multipart/form-data",
      });

     userOwedBusiness = [...userOwedBusiness,serverResponse.data];
     dispatch(setUserBusiness(userOwedBusiness));
      toast.success(serverResponse.message);

      navigate("/profile");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "something went wrong please try again."
      );
    }
  };

  return (
    <>
      <Nav2 pageState={isLight} user={user} />

      <main className={`reg-page ${!isLight ? "dark" : ""}`}>
        <form className="reg-card">
          {/* HEADER */}
          <header className="reg-header">
            <h1>Register Your Business</h1>
            <p>Provide accurate details to list your business.</p>
          </header>

          {/* BODY */}
          <div className="reg-body">
            {/* LEFT */}
            <div className="reg-left">
              <section className="section">
                <h3>Business Information</h3>

                <label>
                  Business Name
                  <input
                    name="businessName"
                    placeholder="Central Coffee House"
                    onChange={handleChange}
                  />
                </label>

                <label>
                  Email
                  <input
                    name="email"
                    type="email"
                    placeholder="contact@business.com"
                    onChange={handleChange}
                  />
                  {emailError && (
                    <div className="Error">
                      <CircleX size={14} />
                      <span>{emailError}</span>
                    </div>
                  )}
                </label>

                <label>
                  Description
                  <textarea
                    name="description"
                    placeholder="Describe your services..."
                    onChange={handleChange}
                  />
                </label>
              </section>

              <section className="section">
                <h3>Address</h3>

                <div className="grid-2">
                  <input
                    name="country"
                    placeholder="Country"
                    onChange={handleLocationChange}
                  />
                  <input
                    name="state"
                    placeholder="State"
                    onChange={handleLocationChange}
                  />
                </div>

                <div className="grid-2">
                  <input
                    name="district"
                    placeholder="District"
                    onChange={handleLocationChange}
                  />
                  <input
                    name="city"
                    placeholder="City"
                    onChange={handleLocationChange}
                  />
                </div>

                <div className="grid-2">
                  <input
                    name="area"
                    placeholder="area"
                    onChange={handleLocationChange}
                  />
                  <input
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleLocationChange}
                  />
                  {pincodeError && (
                    <div className="Error">
                      <CircleX size={14} />
                      <span>{pincodeError}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className="section">
                <h3>Contact</h3>
                <div className="phone-row">
                  <input value="+91" disabled />
                  <input
                    placeholder="Phone number"
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                {phoneNumberError && (
                  <div className="Error">
                    <CircleX size={14} />
                    <span>{phoneNumberError}</span>
                  </div>
                )}
              </section>
            </div>

            {/* RIGHT */}
            <div className="reg-right">
              <section className="section">
                <h3>Shop Location</h3>

                <div className="map-placeholder">
                  <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="map-container"
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <RecenterMap position={position} />
                    <ClickToMoveMarker setPosition={setPosition} />

                    <Marker position={position}>
                      <Popup>Your business location</Popup>
                    </Marker>
                  </MapContainer>
                </div>

                {/* LIVE LOCATION DISPLAY */}
                <div className="location-readout">
                  <span>
                    <strong>Lat:</strong> {position[0].toFixed(6)}
                  </span>
                  <span>
                    <strong>Lng:</strong> {position[1].toFixed(6)}
                  </span>
                </div>
              </section>

              <section className="section">
                <h3>Business Photo</h3>
                <div className="image-upload">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" />
                  ) : (
                    <div className="image-placeholder">
                      Upload business image
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={profileRef}
                  />
                </div>
              </section>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="reg-footer">
            <button
              className={`primary-btn ${
                emailError || phoneNumberError || pincodeError || submitError
                  ? "primary-btn-block"
                  : null
              }`}
              onClick={handleSubmit}
            >
              Complete Registration
            </button>
            {submitError && (
              <div className="Error">
                <CircleX size={14} />
                <span>{submitError}</span>
              </div>
            )}
          </footer>
        </form>
      </main>
    </>
  );
};

export default BusinessRegistration;
