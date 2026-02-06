import React from "react";
import { MapPin, Phone, Star, Sparkles } from "lucide-react";
import "./businessCard.css";
import noProfile from "./../../../assets/businessNoFound.png";

const WORD_LIMIT = 14;

const BusinessCard = ({ business, onClick }) => {
  const hasRating = business.rating?.totalReview > 0;

  const rating = hasRating
    ? (
        business.rating.sumOfReview /
        business.rating.totalReview
      ).toFixed(1)
    : null;

  const phone = business.phoneNo?.[0]?.phone?.number;

  // description preview logic
  const desc = business.description || "No description provided";
  const words = desc.split(" ");
  const shouldTrim = words.length > WORD_LIMIT;

  const previewText = shouldTrim
    ? words.slice(0, WORD_LIMIT).join(" ")
    : desc;

  return (
    <div className="biz-card" onClick={() => onClick?.(business)}>
      {/* IMAGE */}
      <div className="biz-image-wrap">
        <img
          src={business.profile || noProfile}
          alt={business.businessName}
          className="biz-thumb"
        />

        {/* smart badge */}
        <div className="badge rating">
          {hasRating ? (
            <>
              <Star size={12} fill="white" /> {rating}
            </>
          ) : (
            <>
              <Sparkles size={12} /> New
            </>
          )}
        </div>

        {/* status */}
        <div
          className={`badge status ${
            business.status === "Closed" ? "closed" : "open"
          }`}
        >
          {business.status}
        </div>
      </div>

      {/* CONTENT */}
      <div className="biz-content">
        <h3 className="biz-name">{business.businessName}</h3>

        <div className="biz-categories">
          {business.categories?.slice(0, 3).map((cat, i) => (
            <span key={i} className="cat-pill">
              {cat}
            </span>
          ))}
        </div>

        {/* description preview */}
        <p className="biz-desc">
          {previewText}
          {shouldTrim && (
            <span className="more-text"> ...more</span>
          )}
        </p>

        <div className="biz-meta">
          <span>
            <MapPin size={12} />
            {business.location?.city || "Nearby"}
          </span>

          {phone && (
            <span>
              <Phone size={12} />
              {phone}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
