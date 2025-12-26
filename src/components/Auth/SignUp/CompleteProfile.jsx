import { useState, useEffect } from "react";
import "./completeProfile.css";
import nullProfile from "./../../../assets/noDp.png";
import { Pencil, Phone, User, UserCheck } from "lucide-react";
import Input from "./../Input.jsx";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    name: null,
    username: null,
    phone_no: null,
  });

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

  return (
   <section className="Complete-profile-section">
  <div className="profile-header">
    <h1>Complete your profile information</h1>
  </div>

  <div className="profile-content">
    <div className="profile-form-container">
      <div className="dp-container">
        <img src={nullProfile} alt="profile" />
        <button type="button">
          <Pencil className="w-4 h-4" color="black" />
        </button>
      </div>

      <div className="form-container">
        <form className="profile-form">
          <Input
            label="name"
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            icon={<User strokeWidth={0.5} />}
          />

          <Input
            label="username"
            id="username"
            type="text"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            icon={<UserCheck strokeWidth={0.5} />}
          />

          <Input
            label="phone_no"
            id="phone_no"
            type="text"
            name="phone_no"
            placeholder="Enter your phone number"
            value={formData.phone_no}
            onChange={handleChange}
            icon={<Phone strokeWidth={0.5} />}
          />

          <div className="mobile-interest-heading">
            <h1>Select your interests</h1>
          </div>

          <div className="category-container category-container-phone">
            {categories.map((category, index) => (
              <button key={index} type="button" className="category-item">
                {category}
              </button>
            ))}
          </div>
        </form>

        <button className="submit-btn">Complete profile</button>
      </div>
    </div>

    <div className="interest-container">
      <h1>Select your interests</h1>
      <div className="category-container">
        {categories.map((category, index) => (
          <button key={index} type="button" className="category-item">
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
