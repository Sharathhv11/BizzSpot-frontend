import { useState, useEffect } from "react";
import "./../Auth.css";
import banner from "./../../../assets/bannerSignup.png";
import logo from "./../../../assets/logo.png";
import Input from "../Input";
import isValidEmail from "../../../utils/emailVerfier.js";
import { Eye, EyeOff, Mail, User, LoaderCircle } from "lucide-react";
import getNextPasswordRule from "../../../utils/passwordNextRule.js";
import usePost from "../../../hooks/usePost.js";
import toast from "react-hot-toast";
import googleIcon from "../../../assets/google.png";
import { Link } from "react-router-dom";
import useGoogleOauth from "../../../hooks/useGoogleOauth.js";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });

  document.title = "BizSpot | Sign Up";

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { postData, loading } = usePost();

  const {googleLogin,data,loading:loadingGoogle,error} = useGoogleOauth();

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

      /* USERNAME */
      const username = formData.username.trim();

      if (username.length > 0 && !/^[a-z0-9._]{3,20}$/.test(username)) {
        setUsernameError("Username must be 3–20 characters (a–z, 0–9, . or _)");
      } else {
        setUsernameError("");
      }

      /* PASSWORD (one rule at a time) */
      const passwordMessage = getNextPasswordRule(formData.password);
      setPasswordError(passwordMessage);
    }, 500);

    return () => clearTimeout(timeout);
  }, [formData.email, formData.username, formData.password]);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = formData.email.trim();
    const username = formData.username.trim().toLowerCase();

    // Email validation
    if (!email || !isValidEmail(email)) {
      setEmailError("Please enter a valid email before submitting.");
      return;
    }

    // Username validation
    if (!username || usernameError) {
      setUsernameError("Please enter a valid username.");
      return;
    }

    // Password validation
    const passwordMessage = getNextPasswordRule(formData.password);
    if (!formData.password || passwordMessage) {
      setPasswordError("Please enter a valid password before submitting.");
      return;
    }

    try {
      const response = await postData("/auth/sign-up", {
        email,
        username,
        password: formData.password,
      });

      toast.success(
        response?.message || "An email has been sent to your inbox!"
      );
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

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

          <div className="sign-heading-container">
            <h1>Create your BizzSpot account</h1>
            <p>
              Sign up to manage your business presence and connect with
              customers effortlessly.
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
                  placeholder="E-mail: example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  errorStatus={emailError}
                  icon={<Mail strokeWidth={0.5} />}
                />

                <Input
                  label="Username"
                  id="username"
                  type="text"
                  name="username"
                  placeholder="username: john_doe"
                  value={formData.username}
                  onChange={handleChange}
                  errorStatus={usernameError}
                  icon={<User strokeWidth={0.5} />}
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
                  errorStatus={passwordError}
                />
              </div>

              <div className="sign-btn-container">
                <button className="signup-btn" onClick={handleSubmit}>
                  {loading ? (
                    <LoaderCircle className="animate-spin" color="white" />
                  ) : (
                    "Sign Up"
                  )}
                </button>

                <button
                  type="button"
                  className="google-btn"
                  onClick={() => {
                    googleLogin();
                  }}
                >
                  <img src={googleIcon} alt="Google" className="google-icon" />
                  Continue with Google
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="sign-footer">
            <Link to="/login">
              <h3>
                Do have an Account? <span>Login In</span>
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
