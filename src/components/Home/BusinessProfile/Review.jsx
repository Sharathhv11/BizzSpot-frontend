import "./styles/review.css";
import { useState, useEffect } from "react";
import { Rating, Avatar, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector } from "react-redux";

import useGet from "./../../../hooks/useGet";
import { LoaderCircle } from "lucide-react";
import usePatch from "../../../hooks/usePatch";
import toast from "react-hot-toast";

const ReviewCard = ({ review, businessInfo, owned }) => {
  const user = review.userId;

  const userInfo = useSelector((state) => state.user.userInfo);

  const [liked, setLiked] = useState(false);
  const [disLiked, setDisLiked] = useState(false);

  const { patchData, responseData, error, loading } = usePatch();

  const handleLike = async () => {
    const prevLiked = liked;
    const prevDisliked = disLiked;

    try {
      setLiked(!prevLiked);
      if (prevDisliked) setDisLiked(false);

      await patchData(`business/${businessInfo._id}/reviews/${review._id}`, {
        like: true,
      });
    } catch (error) {
      setLiked(prevLiked);
      setDisLiked(prevDisliked);
      toast.error("failed to update like");
    }
  };

  const handleDislike = async () => {
    const prevDisliked = disLiked;
    const prevLiked = liked;

    try {
      setDisLiked(!prevDisliked);
      if (prevLiked) setLiked(false);

      await patchData(`business/${businessInfo._id}/reviews/${review._id}`, {
        dislike: true,
      });
    } catch (error) {
      setDisLiked(prevDisliked);
      setLiked(prevLiked);
      toast.error("failed to update dislike");
    }
  };

  useEffect(() => {
    if (review) {
      const likedByUser = review.like.includes(userInfo.id);
      const dislikedByUser = review.dislike.includes(userInfo.id);

      setLiked(likedByUser);
      setDisLiked(dislikedByUser);
    }
  }, [review]);

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">
          <Avatar
            src={user.profilePicture}
            alt={user.username}
            sx={{ width: 40, height: 40 }}
          />

          <div>
            <h4>{user.username}</h4>
            <Rating value={review.rating} readOnly size="small" />
          </div>
        </div>

        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </div>

      <p className="review-comment">{review.comment}</p>

      <div className="review-footer">
        <span className="review-date">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>

        <div className="review-actions">
          <button onClick={handleLike}>
            <ThumbUpAltOutlinedIcon
              fontSize="small"
              sx={{
                color: liked ? "#1976d2" : "#555",
              }}
            />
          </button>

          <button onClick={handleDislike}>
            <ThumbDownAltOutlinedIcon
              fontSize="small"
              sx={{
                color: disLiked ? "#1976d2" : "#555",
              }}
            />
          </button>

          {/* owner liked indicator */}
          {review.likedByOwner && (
            <FavoriteIcon
              fontSize="small"
              sx={{ color: "#e53935" }}
              titleAccess="liked by owner"
            />
          )}
          {owned && !review.likedByOwner && (
            <FavoriteIcon
              fontSize="small"
              titleAccess="liked by owner"
              sx={{
                color: "#9e9e9e", // soft grey
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                padding: "3px",
                boxShadow: "0 0 0 1px #e0e0e0",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Review = ({ userInfo, businessInfo, owned }) => {
  const REVIEWS_PER_PAGE = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useGet(
    userInfo && businessInfo
      ? `business/${businessInfo._id}/reviews?limit=${REVIEWS_PER_PAGE}&page=${currentPage}`
      : null,
  );

  const reviews = data?.reviews ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalReviews = data?.totalReviews ?? 0;

  return (
    <section className="review">
      <div className="review-title">
        <h2>Reviews</h2>
        <p>{totalReviews} customer reviews</p>
      </div>

      <div className="reviews-list">
        {loading && (
          <div className="review-loader">
            <LoaderCircle className="animate-spin" color="black" />
          </div>
        )}

        {!loading && reviews.length === 0 && <p>No reviews yet</p>}

        {!loading &&
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              businessInfo={businessInfo}
              owned={owned}
            />
          ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination-container">
          {Array.from({ length: currentPage }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </button>
          ))}

          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage((p) => p + 1)}>Next</button>
          )}
        </div>
      )}
    </section>
  );
};

export default Review;
