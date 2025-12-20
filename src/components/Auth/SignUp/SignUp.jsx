import { useState, useEffect } from "react";
import "./signup.css";
import banner from "./../../../assets/bannerSignup.png";
import logo from "./../../../assets/logo.png";
import Input from "../Input";
import isValidEmail from "../../../utils/emailVerfier.js";
import { Eye, EyeClosed } from "lucide-react";
import getNextPasswordRule from "../../../utils/passwordNextRule.js";
import usePost from "../../../hooks/usePost.js";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { postData } = usePost("/auth/sign-up", formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      /* EMAIL */
      const email = formData.email.trim();
      if (email && !isValidEmail(email)) {
        setEmailError("Email is not valid");
      } else {
        setEmailError("");
      }

      /* PASSWORD (one rule at a time) */
      const passwordMessage = getNextPasswordRule(formData.password);
      setPasswordError(passwordMessage);
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.email, formData.password]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if( !formData.email || !isValidEmail(formData.email) ) {
      setEmailError("Please enter a valid email before submitting.");
      return;
    }
    const passwordMessage = getNextPasswordRule(formData.password);
    if( !formData.password || passwordMessage ) {
      setPasswordError("Please enter a valid password before submitting.");
      return;
    }

    const response =await  postData();

    console.log(response);


  }

  return (
    <section className="signup">
      {/* Right Section */}
      <div className="signup-right">
        <img src={banner} alt="BizzSpot Banner" />
      </div>

      {/* Left Section */}
      <div className="signup-left">
        <div className="card">
          {/* Logo */}
          <div className="logo-box">
            <img src={logo} alt="BizzSpot Logo" />
          </div>

          {/* Form */}
          <div className="form-box">
            <form className="form-box-form">
              <div className="form-input-container">
                <Input
                  label="Email"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="E-mail: Example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  errorStatus={emailError}
                />

                <Input
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password: ********"
                  value={formData.password}
                  onChange={handleChange}
                  icon={showPassword ? <Eye /> : <EyeClosed />}
                  onIconClick={togglePassword}
                  errorStatus={passwordError}
                />
              </div>

              <button  className="signup-btn" onClick={handleSubmit}>
                Sign Up
              </button>
            </form>
          </div>

          {/*footer */}
          <div className="sign-footer">
            <h3>Do have an Account? Log In</h3>
          </div>
        </div>
      </div>
    </section>
  );
}
