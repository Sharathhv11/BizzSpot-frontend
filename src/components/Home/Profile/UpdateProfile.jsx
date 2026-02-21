import { useState, useEffect, useRef } from "react";
import "./updateProfile.css";
import nullProfile from "./../../../assets/noDp.png";
import { Pencil, Phone, User, X, LoaderCircle, CircleX } from "lucide-react";
import usePatch from "./../../../hooks/usePatch.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../../redux/reducers/user.js";
import toast from "react-hot-toast";
import Nav2 from "../Util/Nav2";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const {theme} = useSelector((state) => state.pageState);
  if (!userInfo) return <Navigate to="/" />;

  const [showAllCategories, setShowAllCategories] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    username: userInfo?.username || "",
    phone_no: userInfo?.phone_no || "",
    interest: userInfo?.interest || [],
  });

  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const fileRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);

  const { patchData, loading } = usePatch();

  const categories = [
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterest = (e) => {
    const value = e.target.innerText;

    setFormData((prev) => ({
      ...prev,
      interest: prev.interest.includes(value)
        ? prev.interest.filter((i) => i !== value)
        : [...prev.interest, value],
    }));
  };

  const handleSubmit = async () => {
    if (nameError || usernameError || phoneError) return;

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("username", formData.username);
    payload.append("phone_no", formData.phone_no);

    formData.interest.forEach((i) => payload.append("interest", i));

    if (fileRef.current?.files.length) {
      payload.append("profilePicture", fileRef.current.files[0]);
    }

    try {
      const serverResponse = await patchData(`/user/${userInfo.id}`, payload, {
        "Content-Type": "multipart/form-data",
      });
      dispatch(setUserInfo(serverResponse.data));
      navigate(`/profile/${userInfo.id}`);
      toast.success("Profile updated!");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, please try again.",
      );
    }
  };

  useEffect(() => {
    const name = formData.name.trim();
    const username = formData.username.trim();
    const phone = formData.phone_no.trim();

    // NAME VALIDATION
    if (name.length === 0) {
      setNameError("Name is required");
    } else if (name.length < 2) {
      setNameError("Name must be at least 2 characters");
    } else if (name.length > 50) {
      setNameError("Name too long (max 50 chars)");
    } else {
      setNameError(""); //  CLEAR error when valid
    }

    // USERNAME VALIDATION
    if (username.length === 0) {
      setUsernameError(""); // Optional field
    } else if (username.includes("@")) {
      setUsernameError("Username cannot contain @");
    } else if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      //  Fixed regex
      setUsernameError("3-50 chars, letters/numbers/_ only");
    } else {
      setUsernameError(""); //  CLEAR when valid
    }

    // PHONE VALIDATION
    if (phone.length === 0) {
      setPhoneError("");
    } else if (!/^[6-9][0-9]{9}$/.test(phone)) {
      //  Indian mobile validation
      setPhoneError("Invalid 10-digit phone (starts with 6-9)");
    } else {
      setPhoneError("");
    }
  }, [formData.name, formData.username, formData.phone_no]);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 4);

  const isFormValid =
    nameError === "" && usernameError === "" && phoneError === "";

  return (
    <>
      <Nav2 />

      <section className={`update-user-profile ${!theme?"dark":null}`}>
        <div className="update-user-profile-card">
          <h2>Edit Profile</h2>

          {/* Avatar */}
          <div className="update-user-profile-dp">
            <img
              src={imagePreview || userInfo?.profilePicture || nullProfile}
              alt="profile"
            />

            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              onChange={(e) =>
                setImagePreview(
                  e.target.files?.[0]
                    ? URL.createObjectURL(e.target.files[0])
                    : null,
                )
              }
            />

            <button onClick={() => fileRef.current.click()}>
              <Pencil size={14} />
            </button>
          </div>

          {/* Inputs */}
          <div className="update-user-profile-form">
            {/* NAME */}
            <div className="update-user-profile-field">
              <label>Name</label>

              <div className="update-user-profile-input-wrap">
                <User size={16} />

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
              </div>

              {nameError && (
                <div className="Error">
                  <CircleX size={14} />
                  <span>{nameError}</span>
                </div>
              )}
            </div>

            {/* USERNAME */}
            <div className="update-user-profile-field">
              <label>Username</label>

              <div className="update-user-profile-input-wrap">
                <User size={16} />

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose username"
                />
              </div>

              {usernameError && (
                <div className="Error">
                  <CircleX size={14} />
                  <span>{usernameError}</span>
                </div>
              )}
            </div>

            {/* PHONE */}
            <div className="update-user-profile-field">
              <label>Phone</label>

              <div className="update-user-profile-input-wrap">
                <Phone size={16} />

                <input
                  type="tel"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  placeholder="10 digit number"
                  maxLength={10}
                />
              </div>

              {phoneError && (
                <div className="Error">
                  <CircleX size={14} />
                  <span>{phoneError}</span>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          <h3 className="update-user-profile-interest-title">Edit Interests</h3>

          <div className="update-user-profile-categories">
            {/* Selected interests */}
            {formData.interest.map((interest, i) => (
              <button
                key={i}
                type="button"
                className="update-user-profile-category-selected"
                onClick={handleInterest}
              >
                {interest}
              </button>
            ))}

            {/* Available categories */}
            {visibleCategories
              .filter((c) => !formData.interest.includes(c))
              .map((c, i) => (
                <button
                  key={i}
                  type="button"
                  className="update-user-profile-category"
                  onClick={handleInterest}
                >
                  {c}
                </button>
              ))}

            {/* Toggle button */}
            {categories.length > 4 && (
              <button
                type="button"
                className="update-user-profile-more-btn"
                onClick={() => setShowAllCategories((prev) => !prev)}
              >
                {showAllCategories ? "Show less" : "+ More"}
              </button>
            )}
          </div>

          {/* Save */}
          <button
            className="update-user-profile-save-btn"
            onClick={handleSubmit}
            disabled={!isFormValid || loading}
          >
            {loading ? (
              <LoaderCircle className="update-user-profile-spin" />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </section>
    </>
  );
};

export default UpdateProfile;
