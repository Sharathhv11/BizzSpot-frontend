import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Nav2 from "../Home/Util/Nav2";
import { changeTheme, changeDistance } from "../../redux/reducers/pageState";
import { ArrowLeft, Sun, Moon, MapPin, Bell, Lock, LogOut } from "lucide-react";
import { resetStates } from "../../redux/reducers/user";
import "./settings.css";
import toast from "react-hot-toast";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const isLight = useSelector((state) => state.pageState.theme);
  const distance = useSelector((state) => state.pageState.distance);

  const [distanceValue, setDistanceValue] = useState(distance / 1000); // Convert to km for display
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    localStorage.getItem("notificationsEnabled") !== "false",
  );

 
  // Redirect if not logged in
  if (!userInfo) {
    return <Navigate to="/login" />;
  }

  const handleDistanceChange = (e) => {
    const km = parseFloat(e.target.value) || 0;
    setDistanceValue(km);
    // Convert km back to meters for storage
    dispatch(changeDistance(km * 1000));
    showSuccess();
  };

  const handleThemeToggle = () => {
    dispatch(changeTheme());
  };

  const handleNotificationToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    localStorage.setItem("notificationsEnabled", newState);
    showSuccess();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetStates());
    navigate("/login");
  };

  const showSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 2000);
  };

  return (
    <>
      <Nav2 />
      <div className={`settings-container ${isLight ? "light" : "dark"}`}>
        {/* Header */}
        <div className="settings-header">
          <h1>Settings</h1>
        </div>

        

        {/* Settings Content */}
        <div className="settings-content">
          {/* Search & Discovery Section */}
          <section className="settings-section">
            <div className="section-title">
              <MapPin size={20} />
              <span>Search & Discovery</span>
            </div>
            <div className="settings-item">
              <div className="item-header">
                <label htmlFor="distance-input">Search Radius</label>
                <span className="distance-display">{distanceValue} km</span>
              </div>
              <p className="item-description">
                Set the maximum distance for discovering nearby businesses
              </p>
              <div className="distance-input-container">
                <input
                  id="distance-input"
                  type="range"
                  min="1"
                  max="50"
                  step="0.5"
                  value={distanceValue}
                  onChange={handleDistanceChange}
                  className="distance-slider"
                />
                <div className="distance-labels">
                  <span>1 km</span>
                  <span>50 km</span>
                </div>
              </div>
              <input
                type="number"
                min="1"
                max="50"
                step="0.5"
                value={distanceValue}
                onChange={handleDistanceChange}
                className="distance-number-input"
                placeholder="Enter distance in km"
              />
            </div>
          </section>

          {/* Appearance Section */}
          <section className="settings-section">
            <div className="section-title">
              <Sun size={20} />
              <span>Appearance</span>
            </div>
            <div className="settings-item">
              <div className="item-header">
                <label>Theme</label>
                <span className="theme-label">
                  {isLight ? "Light" : "Dark"}
                </span>
              </div>
              <p className="item-description">
                Choose your preferred color theme
              </p>
              <button className="theme-toggle-btn" onClick={handleThemeToggle}>
                {isLight ? (
                  <>
                    <Moon size={16} />
                    <span>Switch to Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun size={16} />
                    <span>Switch to Light Mode</span>
                  </>
                )}
              </button>
            </div>
          </section>

         

          {/* Privacy & Security Section */}
          <section className="settings-section">
            <div className="section-title">
              <Lock size={20} />
              <span>Privacy & Security</span>
            </div>
            <div className="settings-item">
              <button
                className="settings-link-btn"
                onClick={() => navigate("/forgot-password")}
              >
                <span>Update Password</span>
                <span className="arrow">→</span>
              </button>
              <p className="item-description">Change your account password</p>
            </div>
            <div className="settings-item">
              <button
                className="settings-link-btn"
                onClick={() => navigate(`/profile/${userInfo?.id}`)}
              >
                <span>Private Account Settings</span>
                <span className="arrow">→</span>
              </button>
              <p className="item-description">
                Manage your profile visibility and privacy
              </p>
            </div>
          </section>

          {/* Account Section */}
          <section className="settings-section">
            <div className="section-title">
              <LogOut size={20} />
              <span>Account</span>
            </div>
            <div className="settings-item">
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
              <p className="item-description">Sign out from your account</p>
            </div>
          </section>

          {/* Info Section */}
          <section className="settings-section info-section">
            <p className="info-text">
              <strong>App Version:</strong> 1.0.0
            </p>
            <p className="info-text">
              For support, contact us at support@bizspot.com
            </p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Settings;
