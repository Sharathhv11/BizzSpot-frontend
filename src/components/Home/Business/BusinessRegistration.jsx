import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Nav2 from "./../Util/Nav2.jsx";
import "./business.css";

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
import { CircleX } from "lucide-react";


//* phone number validator 
import PhoneInput from 'react-phone-input-2'

import 'react-phone-input-2/lib/material.css'

/* ================= LEAFLET MARKER FIX ================= */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ================= RECENTER MAP ================= */
const RecenterMap = ({ position }) => {

  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true });
    }
  }, [position, map]);

  return null;
};

/* ================= CLICK TO MOVE MARKER ================= */
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

  //*email error message pop up state
  const [emailError, setEmailError] = useState("");

  const [position, setPosition] = useState([51.505, -0.09]);

  //* business information state
  const [form, setForm] = useState({
    businessName: "",
    description: "",
    email: "",
    phone: "",
    location: { country: "", state: "", city: "", pincode: "" },
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
    }, 500);

    return ()=>clearTimeout(emailValidator);
  }, [form.email]);

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

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);

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
                    name="city"
                    placeholder="City"
                    onChange={handleLocationChange}
                  />
                  <input
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleLocationChange}
                  />
                </div>
              </section>

              <section className="section">
                <h3>Contact</h3>
               
               
                <div className="phone-row">

                 <PhoneInput
                  country={"in"}
                 />
                  
                </div>
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
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

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
                  />
                </div>
              </section>
            </div>
          </div>

          {/* FOOTER */}
          <footer className="reg-footer">
            <button className="primary-btn">Complete Registration</button>
          </footer>
        </form>
      </main>
    </>
  );
};

export default BusinessRegistration;
