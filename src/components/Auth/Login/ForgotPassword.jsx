import { useEffect, useState } from "react";
import Input from "../Input";
import { Mail, LoaderCircle } from "lucide-react";
import usePost from "../../../hooks/usePost";
import isValidEmail from "../../../utils/emailVerfier";
import "./ForgotPassword.css";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverResponse, setResponse] = useState(null);

  document.title = "BizSpot | Forgot Password";

  const { postData, loading } = usePost();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");

    try {
      await postData("/auth/forgot-password", { email });
      setResponse([true, "success"]);
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to send reset link. Please try again.";
      setResponse([false, message]);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (email.trim() && !isValidEmail(email)) {
        setError("Email is not valid");
      } else {
        setError("");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [email]);

  return (
    <section className="forgot-section">
      {!serverResponse && (
        <form className="forgot-form" onSubmit={handleSubmit}>
          <h2 className="forgot-title">Forgot Password</h2>

          <Input
            label="Email"
            id="email"
            type="email"
            name="email"
            placeholder="E-mail: example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            errorStatus={error}
            icon={<Mail strokeWidth={0.5} />}
          />

          <button className="forgot-btn" type="submit">
            {loading ? (
              <LoaderCircle className="spinner" />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}

      {serverResponse && (
        <div
          className={`forgot-response ${
            serverResponse[0] ? "success" : "error"
          }`}
        >
          {serverResponse[0] ? (
            <>
              <p className="response-title">Reset link sent successfully</p>
              <p className="response-text">
                This link is valid for <b>10 minutes</b> for security reasons.
              </p>
              <p className="response-subtext">
                Didn’t receive the email? <b>Check your spam folder.</b>
              </p>
            </>
          ) : (
            <p>{serverResponse[1]}</p>
          )}
        </div>
      )}
    </section>
  );
};
