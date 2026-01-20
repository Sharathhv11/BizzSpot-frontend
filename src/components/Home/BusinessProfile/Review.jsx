import "./styles/review.css";
import { useState, useEffect } from "react";
import { Rating, Avatar, IconButton, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { pushNav } from "../../../redux/reducers/pageState";

import useGet from "./../../../hooks/useGet";
import useDelete from "./../../../hooks/useDelete";
import usePatch from "../../../hooks/usePatch";
import usePost from "../../../hooks/usePost";

import { LoaderCircle, Trash, Pen } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import formatCount from "../../../utils/countFormate";

const ReviewCard = ({ review, businessInfo, owned, setReloadKey }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = review.userId;

  const userInfo = useSelector((state) => state.user.userInfo);

  const [liked, setLiked] = useState(false);
  const [disLiked, setDisLiked] = useState(false);
  const [ownerLiked, setOwnerLiked] = useState(review.likedByOwner);
  const [ownerOfReview, setOwnerOfReview] = useState(false);

  const [likeCount, setLikeCount] = useState(review.like?.length || 0);
  const [dislikeCount, setDislikeCount] = useState(review.dislike?.length || 0);

  const { patchData, responseData, error, loading } = usePatch();
  const { deleteData } = useDelete();

  const handleLike = async () => {
    const prevLiked = liked;
    const prevDisliked = disLiked;

    try {
      setLiked(!prevLiked);
      setLikeCount((c) => (prevLiked ? c - 1 : c + 1));

      if (prevDisliked) {
        setDisLiked(false);
        setDislikeCount((c) => c - 1);
      }

      await patchData(`business/${businessInfo._id}/reviews/${review._id}`, {
        like: true,
      });
    } catch (error) {
      setLiked(prevLiked);
      setDisLiked(prevDisliked);
      setLikeCount((c) => (prevLiked ? c + 1 : c - 1));
      if (prevDisliked) setDislikeCount((c) => c + 1);
      toast.error("failed to update like");
    }
  };

  const handleDislike = async () => {
    const prevDisliked = disLiked;
    const prevLiked = liked;

    try {
      setDisLiked(!prevDisliked);
      setDislikeCount((c) => (prevDisliked ? c - 1 : c + 1));

      if (prevLiked) {
        setLiked(false);
        setLikeCount((c) => c - 1);
      }

      await patchData(`business/${businessInfo._id}/reviews/${review._id}`, {
        dislike: true,
      });
    } catch (error) {
      setDisLiked(prevDisliked);
      setLiked(prevLiked);
      setDislikeCount((c) => (prevDisliked ? c + 1 : c - 1));
      if (prevLiked) setLikeCount((c) => c + 1);
      toast.error("failed to update dislike");
    }
  };

  const handleOwnerLiked = async () => {
    try {
      await patchData(`business/${businessInfo._id}/reviews/${review._id}`, {
        likedByOwner: true,
      });
      setOwnerLiked(!ownerLiked);
    } catch (error) {
      toast.error("failed to update owner like.");
    }
  };

  useEffect(() => {
    if (review) {
      const likedByUser = review.like.includes(userInfo.id);
      const dislikedByUser = review.dislike.includes(userInfo.id);

      setLiked(likedByUser);
      setDisLiked(dislikedByUser);
    }
    setLikeCount(review.like?.length || 0);
    setDislikeCount(review.dislike?.length || 0);

    if (user._id === userInfo.id) {
      setOwnerOfReview(true);
    }
  }, [review]);

  const handleReviewDelete = async function () {
    try {
      const uri = `business/${businessInfo._id}/reviews/${review._id}`;
      await deleteData(uri);
      setReloadKey((prev) => prev + 1);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "something went wrong please try again.",
      );
    }
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="review-user">
          <Avatar
            src={user.profilePicture}
            alt={user.username}
            sx={{
              width: 40,
              height: 40,
              "& img": {
                objectFit: "cover",
                objectPosition: "top",
              },
            }}
          />

          <div>
            <div className="review-user-container">
              <h4
                className="review-username"
                onClick={() => {
                  dispatch(pushNav(`/business/${businessInfo._id}`));
                  navigate(`/profile/${user._id}`);
                }}
              >
                {user.username}
              </h4>
              <span>(edited)</span>
            </div>
            <Rating value={review.rating} readOnly size="small" />
          </div>
        </div>

        {ownerOfReview && (
          <IconButton size="small" className="more-btn">
            <MoreVertIcon fontSize="small" />

            <div className="more-menu">
              <div className="more-item">
                <Pen size={14} />
                Edit
              </div>
              <div className="more-item danger" onClick={handleReviewDelete}>
                <Trash size={14} />
                Delete
              </div>
            </div>
          </IconButton>
        )}
      </div>

      <p className="review-comment">{review.comment}</p>

      <div className="review-footer">
        <span className="review-date">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>

        <div className="review-actions">
          <div className="reaction">
            <button onClick={handleLike} className="reaction-btn">
              <ThumbUpAltOutlinedIcon
                fontSize="small"
                sx={{ color: liked ? "#1976d2" : "#555" }}
              />
            </button>
            <span className="reaction-count">{formatCount(likeCount)}</span>
          </div>

          <div className="reaction">
            <button onClick={handleDislike} className="reaction-btn">
              <ThumbDownAltOutlinedIcon
                fontSize="small"
                sx={{ color: disLiked ? "#1976d2" : "#555" }}
              />
            </button>
            <span className="reaction-count">{formatCount(dislikeCount)}</span>
          </div>

          {/* owner liked indicator */}
          {ownerLiked && businessInfo?.owner?.profilePicture && (
            <Box
              onClick={owned ? handleOwnerLiked : null}
              sx={{
                position: "relative",
                width: 28,
                height: 28,
                display: "inline-block",
                cursor: "pointer",
                top: "7px",
                left: "4px",
              }}
            >
              {/* Owner profile image */}
              <Avatar
                src={businessInfo.owner.profilePicture}
                alt="Owner"
                sx={{
                  width: 28,
                  height: 28,
                }}
              />

              {/* Heart badge */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -2,
                  right: -2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: "#e53935",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 0 2px white",
                }}
              >
                <FavoriteIcon
                  sx={{ fontSize: 9, color: "#fff" }}
                  titleAccess="liked by owner"
                />
              </Box>
            </Box>
          )}

          {owned && !ownerLiked && (
            <FavoriteIcon
              onClick={owned ? handleOwnerLiked : null}
              fontSize="small"
              titleAccess="liked customer review"
              sx={{
                color: "#9e9e9e",
                backgroundColor: "#ffffff",
                borderRadius: "50%",
                padding: "3px",
                boxShadow: "0 0 0 1px #e0e0e0",
                position: "relative",
                top: "7px",
                left: "4px",
                cursor: "pointer",

                "&:hover": {
                  color: "#f44336",
                },
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
  const [reloadKey, setReloadKey] = useState(0);

  const { data, loading, error } = useGet(
    userInfo && businessInfo
      ? `business/${businessInfo._id}/reviews?limit=${REVIEWS_PER_PAGE}&page=${currentPage}&r=${reloadKey}`
      : null,
  );

  const reviews = data?.reviews ?? [];
  const totalPages = data?.totalPages ?? 0;
  const totalReviews = data?.totalReviews ?? 0;

  const theme = useSelector((state) => state.pageState.theme);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { postData, loading: formLoading } = usePost();

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      await postData(`business/${businessInfo._id}/reviews`, {
        rating,
        comment,
      });

      toast.success("Review submitted successfully");
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error("Failed to submit review");
    }
  };

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

        {!loading && reviews.length === 0 && (
          <Box
            sx={{
              gridColumn: "1 / -1",
              height: "100%",
              borderRadius: 2,

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.2,

              backgroundColor: theme ? "#fcfafa" : "#111",
              border: theme
                ? "1px dashed rgba(0,0,0,0.25)"
                : "1px dashed rgba(255,255,255,0.25)",

              color: theme ? "#555" : "rgba(255,255,255,0.75)",
              textAlign: "center",
              padding: "10px",
            }}
          >
            <Box sx={{ fontSize: 16, fontWeight: 600 }}>
              No media uploaded yet
            </Box>

            <Box sx={{ fontSize: 14, maxWidth: 420 }}>
              Upload photos or videos to showcase your business.
            </Box>

            <Box sx={{ fontSize: 13 }}>
              Free account: up to <strong>3</strong> media · Paid account: up to{" "}
              <strong>5</strong> media
            </Box>
          </Box>
        )}

        {!loading &&
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              businessInfo={businessInfo}
              owned={owned}
              setReloadKey={setReloadKey}
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

      {!owned && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Write a review</h3>

          {/* Rating */}
          <div className="form-group">
            <label>Rating</label>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="medium"
            />
          </div>

          {/* Comment */}
          <div className="form-group">
            <label>Your review</label>
            <textarea
              placeholder="Share your experience (max 500 characters)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={500}
              required
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          {/* Submit */}
          <button type="submit" className="submit-review">
            Submit review
          </button>
        </form>
      )}
    </section>
  );
};

export default Review;
