import { useState } from "react";
import useAuthRedirect from "../../../hooks/useAuthRedirect";
import axiosInstance from "../../../APIs/AxiosInstance";
import toast from "react-hot-toast";
import "./completeProfile.css";

const interestsList = [
  "Clothing Store",
  "Electronics",
  "Mobile Store",
  "Furniture",
  "Restaurant",
  "Cafe",
  "Bakery",
  "IT Services",
  "Marketing Agency",
  "Hospital",
  "Clinic",
  "Fitness Centre",
];

const CompleteProfile = () => {
  useAuthRedirect("/");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone_no: "",
    interest: [],
    profilePicture: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔹 Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Toggle interest buttons
  const toggleInterest = (item) => {
    setFormData((prev) => ({
      ...prev,
      interest: prev.interest.includes(item)
        ? prev.interest.filter((i) => i !== item)
        : [...prev.interest, item],
    }));
  };

  // 🔹 Submit profile
  const handleSubmit = async () => {
    if (!formData.name || !formData.username || !formData.phone_no) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.interest.length === 0) {
      toast.error("Select at least one interest");
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.patch("/user/complete-profile", formData);
      toast.success("Profile completed successfully");
      window.location.href = "/";
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* LEFT PANEL */}
      <div className="profile-left">
        <div className="avatar-box">
          <img
            src={
              formData.profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt="Profile"
          />
        </div>

        <input
          type="text"
          name="profilePicture"
          placeholder="Profile Image URL"
          value={formData.profilePicture}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
        />

        <input
          type="text"
          name="phone_no"
          placeholder="Phone Number"
          value={formData.phone_no}
          onChange={handleChange}
        />

        <button onClick={handleSubmit} disabled={loading}>
          {loading ? "Saving..." : "Save & Continue"}
        </button>
      </div>

      {/* RIGHT PANEL */}
      <div className="profile-right">
        <h2>Select Your Interests</h2>
        <p>You can choose multiple</p>

        <div className="interest-grid">
          {interestsList.map((item) => (
            <button
              key={item}
              className={
                formData.interest.includes(item)
                  ? "interest-btn active"
                  : "interest-btn"
              }
              onClick={() => toggleInterest(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;
