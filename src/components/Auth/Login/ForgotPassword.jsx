import { useEffect, useState } from "react";
import Input from "../Input";
import { Mail } from "lucide-react";
import usePost from "../../../hooks/usePost";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

import isValidEmail from "../../../utils/emailVerfier";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [serverResponse, setResponse] = useState(null);

  document.title = "BizSpot | Forgot Password";

  const { postData, responseData, error: postError, loading } = usePost();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    setError("");

    try {
      const responseData = await postData("/auth/forgot-password", { email });
      if (responseData) {
        setResponse([true, "Password reset link sent to your email."]);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Failed to send reset link. Please try again.";

      setResponse([false, message]);
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
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
    <section style={styles.section}>
      {!serverResponse && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Forgot Password</h2>

          <Input
            label="Email"
            id="email"
            type="email"
            name="email"
            placeholder="E-mail: Example@gmail.com"
            value={email}
            onChange={handleChange}
            errorStatus={error}
            icon={<Mail strokeWidth={0.5} />}
          />

          <button
            type="submit"
            style={styles.button}
            className="forgot-password-btn"
          >
            {loading ? (
              <LoaderCircle
                className="animate-spin"
                color="white"
                style={{
                  margin: "0 auto",
                }}
              />
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      )}
      {serverResponse && (
        <div
          style={{
            ...styles.responseMessage,
            color: serverResponse[0] ? "#0f9d58" : "#d93025",
          }}
        >
          <p style={{ fontSize: "22px", fontWeight: "600" }}>
            {serverResponse[0]
              ? "Reset link sent successfully"
              : serverResponse[1]}
          </p>

          {serverResponse[0] && (
            <>
              <p style={{ fontSize: "15px", marginTop: "10px", color: "#555" }}>
                This link is valid for <b>10 minutes</b> for security reasons.
              </p>
              <p style={{ fontSize: "14px", marginTop: "6px", color: "#777" }}>
                Didn’t receive the email? <b>Check your spam folder.</b>
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
};

const styles = {
  section: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f5f6fa",
  },
  form: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  title: {
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#333",
    fontSize: "1.5rem",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  error: {
    color: "red",
    fontSize: "13px",
    marginBottom: "10px",
  },
  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#1e49f8",
    color: "#fff",
    fontSize: "15px",
    cursor: "pointer",
    fontWeight: "600",
  },
  responseMessage: {
    marginTop: "15px",
    fontSize: "30px",
    textAlign: "center",
    fontWeight: "bold",
  },
};
