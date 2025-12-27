import { useState, useEffect, useRef } from "react";
import "./completeProfile.css";
import nullProfile from "./../../../assets/noDp.png";
import { Pencil, Phone, User, UserCheck, X } from "lucide-react";
import Input from "./../Input.jsx";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone_no: "",
    interest: [],
  });

  const fileRef = useRef();

  const [imagePreview, setImagePreview] = useState(null);

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

  const handleInterest = (e) => {
    const selectedInterest = e.target.innerText;
    if (selectedInterest && !formData.interest.includes(selectedInterest)) {
      setFormData((prev) => ({
        ...prev,
        interest: [...prev.interest, selectedInterest],
      }));
    } else if (selectedInterest) {
      const updatedInterests = formData.interest.filter(
        (interest) => interest !== selectedInterest
      );
      setFormData((prev) => ({
        ...prev,
        interest: updatedInterests,
      }));
    }
  };

  return (
    <section className="Complete-profile-section">
      <div className="profile-header">
        <h1>Complete your profile information</h1>
      </div>

      <div className="profile-content">
        <div className="profile-form-container">
          <div className="dp-container">
            <img src={imagePreview || nullProfile} alt="profile" />
            <input
              type="file"
              name="profile"
              id="profile"
              ref={fileRef}
              accept="image/*"
              onChange={(e) =>
                setImagePreview(URL.createObjectURL(e.target.files[0]))
              }
              hidden
            />
            <button
              type="button"
              onClick={(e) => {
                fileRef.current.click();
              }}
            >
              <Pencil className="w-4 h-4 pencil" color="black" />
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
                          target: {
                            innerText: interest,
                          },
                        })
                      }
                    />
                  </button>
                ))}

                {categories
                  .filter(
                    (categories) => !formData.interest.includes(categories)
                  )
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

            <button className="submit-btn">Complete profile</button>
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
                      target: {
                        innerText: interest,
                      },
                    })
                  }
                />
              </button>
            ))}

            {categories
              .filter((categories) => !formData.interest.includes(categories))
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
