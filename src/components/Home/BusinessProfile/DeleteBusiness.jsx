import React, { useState } from "react";
import { Trash2, AlertTriangle, X, LoaderCircle } from "lucide-react";
import "./styles/deleteBusiness.css";
import useDelete from "@/hooks/useDelete";
import { useDispatch, useSelector } from "react-redux";
import { removeUserBusiness } from "@/redux/reducers/user";
import { useNavigate } from "react-router-dom";
import { popNav } from "@/redux/reducers/pageState";
import toast from "react-hot-toast";

const DeleteBusiness = ({ business }) => {
  const [isOpen, setIsOpen] = useState(false); // Hidden by default
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { navStack } = useSelector((state) => state.pageState);

  const {
    deleteData,
    responseData,
    error,
    loading: deletionLoading,
  } = useDelete();

  const REQUIRED_TEXT = "DELETE";

  const handleDelete = async () => {
    if (confirmText !== REQUIRED_TEXT) return;

    setLoading(true);

    try {
      const serverResponse = await deleteData(
        business ? `business/${business._id}` : null,
      );
      dispatch(removeUserBusiness(business._id));
      toast.success("successfully deleted business");
      navigate(navStack.length > 0 ? navStack[navStack.length - 1] : "/");
      dispatch(popNav());
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong, please try again.",
      );
    } finally {
      setLoading(false);
      setIsOpen(false);
      setConfirmText("");
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setConfirmText("");
  };

  return (
    <>
      {/* Delete Button - Always Visible */}
      <button
        className="delete-business-btn"
        onClick={() => setIsOpen(true)}
        title="Delete Business"
      >
        <Trash2 size={20} />
        Delete
      </button>

      {/* Modal - Hidden until opened */}
      {isOpen && (
        <div className="delete-overlay" onClick={closeModal}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="delete-header">
              <AlertTriangle size={28} className="warning-icon" />
              <h2>Delete Business</h2>
            </div>

            {/* Warning */}
            <p className="delete-warning">
              This will permanently delete <b>{business?.businessName}</b>. This
              cannot be undone.
            </p>

            {/* Confirmation input */}
            <div className="confirm-box">
              <label>
                Type <b>{REQUIRED_TEXT}</b> to confirm:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="Type DELETE"
                disabled={loading}
              />
            </div>

            {/* Actions */}
            <div className="delete-actions">
              <button
                className="cancel-btn"
                onClick={closeModal}
                disabled={loading}
              >
                <X size={18} />
                Cancel
              </button>

              <button
                className={`delete-btn ${confirmText === REQUIRED_TEXT ? "enabled" : ""}`}
                onClick={handleDelete}
                disabled={confirmText !== REQUIRED_TEXT || loading}
              >
                {loading ? (
                  <LoaderCircle size={18} className="spin" />
                ) : (
                  <Trash2 size={18} />
                )}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteBusiness;
