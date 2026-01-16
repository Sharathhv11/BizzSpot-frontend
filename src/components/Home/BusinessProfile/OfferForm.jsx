import React, { useState, useEffect } from "react";
import "./styles/form.css";
import { CircleX, LoaderCircle, X } from "lucide-react";
import usePost from "./../../../hooks/usePost";
import usePatch from "./../../../hooks/usePatch";
import toast from "react-hot-toast";
import { useRef } from "react";

const OfferForm = ({
  offers,
  displayForm,
  businessID,
  initialState = {},
  clearInitialState,
}) => {
  //  Form state with all offer fields
  const [formData, setFormData] = useState({
    offerName: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    startingDate: "",
    endingDate: "",
  });

  const [updatedBanner, setUpdatedBanner] = useState(false);

  useEffect(() => {
    if (initialState && initialState._id) {
      // EDIT MODE
      setFormData({
        offerName: initialState.offerName || "",
        description: initialState.description || "",
        discountType: initialState.discount?.type || "percentage",
        discountValue: initialState.discount?.value?.toString() || "",
        startingDate: initialState.startingDate
          ? new Date(initialState.startingDate).toISOString().split("T")[0]
          : "",
        endingDate: initialState.endingDate
          ? new Date(initialState.endingDate).toISOString().split("T")[0]
          : "",
      });

      setPreview(initialState.image);
    }
  }, [initialState]);

  const bannerRef = useRef();

  const { postData, responseData, error: serverError, loading } = usePost();
  const {
    patchData,
    responseData: patchResponseData,
    error: patchError,
    loading: patchLoading,
  } = usePatch();

  //  Image preview and error states
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");

  //  Handle text inputs and selects
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //  Handle image upload with preview generation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUpdatedBanner(true);
  };

  //  Form submission with validation and FormData creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!(formData.offerName.length >= 1 && formData.offerName.length <= 20)) {
      setError("Offer name must be 2-19 characters long");
      return;
    }

    if (
      !(formData.description.length >= 10 && formData.description.length <= 100)
    ) {
      setError("Description must be 10-50 characters long");
      return;
    }

    //  Date validation
    if (new Date(formData.endingDate) <= new Date(formData.startingDate)) {
      setError("Ending date must be after starting date");
      return;
    }

    //  Create FormData payload matching Mongoose schema
    const payload = new FormData();
    payload.append("offerName", formData.offerName);
    payload.append("description", formData.description);

    //  Nested discount object for schema compliance
    payload.append("discount[type]", formData.discountType);
    payload.append("discount[value]", Number(formData.discountValue));

    payload.append(
      "startingDate",
      new Date(formData.startingDate + "T00:00:00Z").toISOString()
    );
    payload.append(
      "endingDate",
      new Date(formData.endingDate + "T00:00:00Z").toISOString()
    );

    if (bannerRef.current.files[0] && updatedBanner) {
      payload.append("offerBanner", bannerRef.current.files[0]); // Use correct backend field name
    }

    setError("");

    try {
      let serverResponse;

      if (!initialState || Object.keys(initialState).length === 0) {
        //  CREATE MODE
        serverResponse = await postData(
          `business/${businessID}/offers`,
          payload,
          {
            "Content-Type": "multipart/form-data",
          }
        );

        // Add NEW offer to array
        const nOffers = [...offers[0], serverResponse?.data];
        offers[1](nOffers);

        toast.success("Offer created successfully! 🎉");
      } else {
        for (let [key, value] of payload.entries()) {
          console.log(key, value);
        }

        serverResponse = await patchData(
          `business/${businessID}/offers/${initialState._id}`,
          payload,
          {
            "Content-Type": "multipart/form-data",
          }
        );

        // Replace OLD offer with NEW server data
        const updatedOffers = offers[0].map((offer) =>
          offer._id === initialState._id ? serverResponse?.data : offer
        );
        offers[1](updatedOffers);

        clearInitialState({});
        toast.success("Offer updated successfully! 🎉");
      }

      displayForm(false); // Close form (common for both)
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again."
      );
    }
  };

  return (
    <div className="offer-register">
      <form className="offer-form" onSubmit={handleSubmit}>
        <h2>Create Offer</h2>

        {/*  Banner upload with live preview */}
        <label className="banner-label">
          {preview ? (
            <img src={preview} alt="Offer Banner" />
          ) : (
            <span>Upload Offer Banner</span>
          )}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
            ref={bannerRef}
          />
        </label>

        {/*  Offer name input */}
        <input
          type="text"
          name="offerName"
          placeholder="Offer Name"
          maxLength={50}
          value={formData.offerName}
          onChange={handleChange}
          required
        />

        {/*  Description textarea */}
        <textarea
          name="description"
          placeholder="Offer Description"
          maxLength={200}
          rows="3"
          value={formData.description}
          onChange={handleChange}
          required
        />

        {/*  Discount type & value row */}
        <div className="form-row">
          <select
            name="discountType"
            value={formData.discountType}
            onChange={handleChange}
          >
            <option value="percentage">Percentage (%)</option>
            <option value="flat">Flat (₹)</option>
          </select>

          <input
            type="number"
            name="discountValue"
            placeholder="Discount Value"
            min={1}
            value={formData.discountValue}
            onChange={handleChange}
            required
          />
        </div>

        {/*  Date range picker row */}
        <div className="form-row">
          <input
            type="date"
            name="startingDate"
            value={formData.startingDate}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="endingDate"
            value={formData.endingDate}
            onChange={handleChange}
            required
          />
        </div>

        {/*Error display */}
        {error && (
          <div className="Error">
            <CircleX size={14} />
            <span>{error}</span>
          </div>
        )}

        {/*  Submit button */}
        <div className="offer-form-btn-container">
          <button
            className="offer-register-cancel-btn"
            onClick={() => {
              displayForm(false);
              clearInitialState({});
            }}
          >
           cancel
          </button>
          <button type="submit">
            {loading || patchLoading ? (
              <LoaderCircle className="animate-spin mx-auto" color="white" />
            ) : Object.keys(initialState).length !== 0 ? (
              "Update Offer"
            ) : (
              "Save Offer"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferForm;
