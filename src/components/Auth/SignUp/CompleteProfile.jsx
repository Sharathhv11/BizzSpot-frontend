import { useState, useEffect, useRef } from "react";
import "./completeProfile.css";
import nullProfile from "./../../../assets/noDp.png";
import { Pencil, Phone, User, X, LoaderCircle } from "lucide-react";
import Input from "./../Input.jsx";
import usePatch from "./../../../hooks/usePatch.js";
import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "../../../redux/reducers/user.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const CompleteProfile = () => {
  // Verify user access (important for refresh)
  const userInfo = useSelector((state) => state.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!userInfo) navigate("/");
  }, [userInfo, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone_no: "",
    interest: [],
  });

  const [phoneError, setPhoneError] = useState("");
  const [NameError, setNameError] = useState("");
  const [UserNameError, setUserNameError] = useState("");

  const fileRef = useRef();
  const [imagePreview, setImagePreview] = useState(null);

  const { patchData, loading, error, responseData } = usePatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo?.id) return;

    const isGoogleUser = userInfo?.authProvider === "google";

    // *LOCAL USER → NAME REQUIRED
    if (!isGoogleUser) {
      if (!formData.name.trim()) {
        setNameError("Name is required");
        return;
      }
      setNameError("");
    }

    // *GOOGLE USER → USERNAME REQUIRED
    if (isGoogleUser) {
      const username = formData.username; // !safe fallback

      if (!username || !username.trim()) {
        setUserNameError("Username is required");
        return;
      }

      if (username.includes("@")) {
        setUserNameError("Username cannot contain '@'");
        return;
      }

      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
        setUserNameError(
          "Username must be 3–20 characters and contain only letters, numbers, or _"
        );
        return;
      }

      setUserNameError("");
    }

    // * PHONE (COMMON FOR BOTH)
    if (!formData.phone_no.trim()) {
      setPhoneError("Phone number is required");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone_no)) {
      setPhoneError("Phone number must be 10 digits");
      return;
    }

    setPhoneError("");

    // * BUILD PAYLOAD
    const payload = new FormData();

    if (isGoogleUser) {
      payload.append("username", formData.username ?? formData.name);
    } else {
      payload.append("name", formData.name);
    }

    payload.append("phone_no", formData.phone_no);

    if (formData.interest.length) {
      formData.interest.forEach((item) => payload.append("interest", item));
    }

    if (fileRef.current?.files?.[0]) {
      payload.append("profilePicture", fileRef.current.files[0]);
    }


    

    try {
      await patchData(`/user/${userInfo.id}`, payload, {
        "Content-Type": "multipart/form-data",
      });

      toast.success("Profile information updated successfully");

      dispatch(
        setUserInfo({
          ...userInfo,
          ...(isGoogleUser
            ? { username: formData.username}
            : { name: formData.name }),
          phone_no: formData.phone_no,
          interest: formData.interest,
          profileCompleted:true
        })
      );

      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      const isGoogleUser = userInfo?.authProvider === "google";

      //* name for local auth users
      if (!isGoogleUser) {
        const name = formData.name.trim();
        if (name.length !== 0) {
          setNameError("");
        }
      }

      //* username for oauth users
      if (isGoogleUser) {
        const username = formData.username.trim();

        if (username.length === 0) {
          setUserNameError("");
        } else if (username.includes("@")) {
          setUserNameError("Username cannot contain '@'");
        } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
          setUserNameError(
            "Username must be 3–20 characters and contain only letters, numbers, or _"
          );
        } else {
          setUserNameError("");
        }
      }

      //* Phone
      const phone = formData.phone_no.trim();
      if (phone.length !== 0 && !/^[0-9]{10}$/.test(phone)) {
        setPhoneError("Phone number must be 10 digits");
      } else if (phone.length === 0 || phone.length === 10) {
        setPhoneError("");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [
    formData.name,
    formData.username,
    formData.phone_no,
    userInfo?.authProvider,
  ]);

  const handleInterest = (e) => {
    const selectedInterest = e.target.innerText;

    if (!selectedInterest) return;

    if (!formData.interest.includes(selectedInterest)) {
      setFormData((prev) => ({
        ...prev,
        interest: [...prev.interest, selectedInterest],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        interest: prev.interest.filter(
          (interest) => interest !== selectedInterest
        ),
      }));
    }
  };

  return (
    <section className="Complete-profile-section">
      <div className="profile-header-complete-profile">
        <h1>Complete your profile information</h1>
      </div>

      <div className="profile-content">
        <div className="profile-form-container">
          <div className="dp-container">
            <img
              src={imagePreview || userInfo?.profilePicture || nullProfile}
              alt="profile"
            />

            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              hidden
              onChange={(e) =>
                setImagePreview(
                  e.target.files?.[0]
                    ? URL.createObjectURL(e.target.files[0])
                    : null
                )
              }
            />

            <button type="button" onClick={() => fileRef.current.click()}>
              <Pencil className="w-4 h-4 pencil" color="black" />
            </button>
          </div>

          <div className="form-container">
            <form className="profile-form">
              <div className="cmp-profile-ip-container">
                {userInfo?.authProvider === "google" ? (
                  <Input
                    label="userName"
                    id="username"
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    errorStatus={UserNameError}
                    icon={<User strokeWidth={0.5} />}
                  />
                ) : (
                  <Input
                    label="name"
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    errorStatus={NameError}
                    icon={<User strokeWidth={0.5} />}
                  />
                )}

                <Input
                  label="phone_no"
                  id="phone_no"
                  type="tel"
                  name="phone_no"
                  placeholder="Enter your phone number"
                  value={formData.phone_no}
                  onChange={handleChange}
                  icon={<Phone strokeWidth={0.5} />}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  inputMode="numeric"
                  errorStatus={phoneError}
                />
              </div>

              <div className="mobile-interest-heading">
                <h1>Select your interests</h1>
              </div>

              <div className="category-container category-container-phone">
                {formData.interest.map((interest, index) => (
                  <button
                    key={index}
                    type="button"
                    className="category-item-selected"
                    onClick={handleInterest}
                  >
                    {interest}
                    <X
                      className="remove-icon"
                      strokeWidth={0.5}
                      onClick={() =>
                        handleInterest({
                          target: { innerText: interest },
                        })
                      }
                    />
                  </button>
                ))}

                {categories
                  .filter((category) => !formData.interest.includes(category))
                  .map((category, index) => (
                    <button
                      key={index}
                      type="button"
                      className="category-item"
                      onClick={handleInterest}
                    >
                      {category}
                    </button>
                  ))}
              </div>
            </form>

            <button className="submit-btn" onClick={handleSubmit}>
              {loading ? (
                <LoaderCircle className="animate-spin" color="white" />
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </div>

        <div className="interest-container">
          <h1>Select your interests</h1>

          <div className="category-container">
            {formData.interest.map((interest, index) => (
              <button
                key={index}
                type="button"
                className="category-item-selected"
                onClick={handleInterest}
              >
                {interest}
                <X
                  className="remove-icon"
                  strokeWidth={0.5}
                  onClick={() =>
                    handleInterest({
                      target: { innerText: interest },
                    })
                  }
                />
              </button>
            ))}

            {categories
              .filter((category) => !formData.interest.includes(category))
              .map((category, index) => (
                <button
                  key={index}
                  type="button"
                  className="category-item"
                  onClick={handleInterest}
                >
                  {category}
                </button>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompleteProfile;
