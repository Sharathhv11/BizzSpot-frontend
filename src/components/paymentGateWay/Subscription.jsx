import { useState, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setUserInfo } from "../../redux/reducers/user";

import usePost from "../../hooks/usePost";
import "./payment.css";
import { Navigate } from "react-router-dom";
import logo from "./../../assets/logo.png";
import Nav2 from "../Home/Util/Nav2";
import toast from "react-hot-toast";

const Subscription = () => {
  const user = useSelector((state) => state.user.userInfo);
  const { theme } = useSelector((state) => state.pageState);
  if (!user) {
    return <Navigate to="/" />;
  }

  const { postData, responseData, error, loading } = usePost();

  const [paymentError, setPaymentError] = useState("");

  const dispatch = useDispatch();

  const handlePayment = async function (e) {
    try {
      const serverResponse = await postData("payment/order", {
        amount: 250,
        currency: "INR",
        receipt: `${user?.id}`,
        notes: {
          userID: user?.id,
        },
      });

      const { data: order } = serverResponse;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: "250",
        currency: "INR",
        name: "NearGo",
        description: "Test Transaction",
        image: logo,
        order_id: order.id,

        handler: async function (response) {
          const body = {
            ...response,
            order_id: order.id,
          };

          try {
            const serverVerificationRes = await postData(
              "payment/verification",
              body,
            );
            toast.success("Payment validated successfully");

            dispatch(setUserInfo(serverVerificationRes.data));
          } catch (error) {
            toast.error(
              error.response.data.message ||
                "something went wrong in verification of the payment.",
            );
          }

          // send these to backend for verification
        },

        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },

        notes: {
          address: "Razorpay Corporate Office",
        },

        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        console.error("Razorpay Payment Failed:", response.error);

        const message =
          response.error.description || "Payment failed. Please try again.";

        setPaymentError(message);
      });
      rzp1.open();
      e.preventDefault();
    } catch (error) {}
  };

  return (
    <>
      <Nav2 pageState={theme} user={user} />
      {paymentError && (
        <div className="payment-error">
          {/* <CircleX size={14} /> */}
          <span>{paymentError}</span>
        </div>
      )}
      <div className="subscription-container">
        {/* Free Plan */}
        <div className="subscription-card free">
          <h2>Free Plan</h2>
          <p className="price">₹0 / month</p>

          <ul>
            <li>✔ Basic access</li>
            <li>✔ Limited features</li>
            <li>✔ Community support</li>
            <li>✖ No premium add-ons</li>
          </ul>

          <button className="btn disabled" disabled>
            Current Plan
          </button>
        </div>

        {/* Premium Plan */}
        <div className="subscription-card premium">
          <h2>Premium Plan</h2>
          <p className="price">₹250 / month</p>

          <ul>
            <li>✔ Everything in Free</li>
            <li>✔ Premium add-on services</li>
            <li>✔ Priority support</li>
            <li>✔ Advanced analytics</li>
          </ul>

          <button className="btn primary" onClick={handlePayment}>
            Go Premium
          </button>
        </div>
      </div>
    </>
  );
};

export default Subscription;
