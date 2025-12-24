import { useState, useEffect } from "react";
import "./../Auth.css"; // reuse same CSS
import banner from "./../../../assets/bannerSignup.png";
import logo from "./../../../assets/logo.png";
import Input from "../Input";
import isValidEmail from "../../../utils/emailVerfier.js";
import { Eye, EyeOff, Mail,LoaderCircle } from "lucide-react";
import usePost from "../../../hooks/usePost.js";
import toast from "react-hot-toast";
import googleIcon from "../../../assets/google.png";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  document.title = "BizSpot | Login";

  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  //^  usePost hook for posting the login information 

   const { postData, responseData, error, loading } = usePost();
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* Email validation only */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const email = formData.email.trim();
      if (email && !isValidEmail(email)) {
        setEmailError("Email is not valid");
      } else {
        setEmailError("");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.email]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !isValidEmail(formData.email)) {
      setEmailError("Please enter a valid email.");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password.");
      return;
    }

    try {

      const response = await postData("/auth/login",formData);
     
      localStorage.setItem("token", response.token);
      toast.success(response.message || "Login successful!");

      navigate("/");
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Invalid email or password.";

      toast.error(message);
    }
  };

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

          {/* Heading */}
          <div className="sign-heading-container">
            <h1>Welcome back to BizzSpot</h1>
            <p>
              Login to manage your business and stay connected with your
              customers.
            </p>
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
                  icon={<Mail strokeWidth={0.5} />}
                />

                <Input
                  label="Password"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="password: ********"
                  value={formData.password}
                  onChange={handleChange}
                  icon={
                    showPassword ? (
                      <Eye strokeWidth={0.5} />
                    ) : (
                      <EyeOff strokeWidth={0.5} />
                    )
                  }
                  onIconClick={togglePassword}
                />
              </div>

              <div className="sign-btn-container">
                {
                 
                <button className="signup-btn" onClick={handleSubmit}>
                  {
                     loading ? <LoaderCircle className="animate-spin" color="white" /> : "Login"
                  }
                </button>
                  
                }

                <button
                  type="button"
                  className="google-btn"
                  onClick={() => {
                    console.log("google oauth login");
                  }}
                >
                  <img
                    src={googleIcon}
                    alt="Google"
                    className="google-icon"
                  />
                  Continue with Google
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="sign-footer">
            <Link to="/sign-up">
              <h3>
                Don’t have an account? <span>Sign Up</span>
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
