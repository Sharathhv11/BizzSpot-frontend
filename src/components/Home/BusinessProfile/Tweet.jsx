import "./styles/tweet.css";

import { useEffect, useRef, useState } from "react";
import { CircleX, LoaderCircle, Trash } from "lucide-react";
import usePost from "./../../../hooks/usePost";
import { Heart, MessageCircle, Eye, Edit3, Globe, Users } from "lucide-react";
import { useSelector } from "react-redux";

import toast from "react-hot-toast";
import useGet from "../../../hooks/useGet";
import { Avatar } from "@mui/material";
import TweetCard from "../Util/TweetCard";

const Tweet = ({ owned, businessInfo }) => {
  const [tweets, setTweets] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postLimit, setPostLimit] = useState(2);
  const [totalPages, setTotalPages] = useState(0);

  const { data, loading, error } = useGet(
    businessInfo
      ? `business/${businessInfo._id}/tweets?limit=${postLimit}&page=${currentPage}`
      : null,
  );

  useEffect(() => {
    if (data) {
      setTweets(data.data);
      setTotalPages(data.totalPages);
    }
  }, [data]);

  return (
    <>
      <div className="review-title post-title">
        <h2>Published Posts</h2>
        <p>Stories, updates, and insights</p>
      </div>
      <section className="tweet-section">
        {tweets.length > 0 && (
          <div className="tweet-card-holder">
            {tweets.map((tweet) => (
              <>
                <TweetCard tweet={tweet} key={tweet._id}/>
              </>
            ))}
            {totalPages > 1 && (
              <div className="pagination-container">
                {Array.from({ length: currentPage }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={page === currentPage ? "active" : ""}
                    >
                      {page}
                    </button>
                  ),
                )}

                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage((p) => p + 1)}>
                    Next
                  </button>
                )}
              </div>
            )}
          </div>
        )}
        {owned && <TweetForm businessInfo={businessInfo} />}
      </section>
    </>
  );
};

const TweetForm = ({ businessInfo }) => {
  const [formData, setFormData] = useState({
    tweet: "",
    mediaFiles: [],
    hashtags: "",
    visibility: "public",
  });

  const user = useSelector((state) => state.user.userInfo);

  const [formError, setFormError] = useState("");

  const { postData, responseData, error, loading } = usePost();
  const mediaRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const mapped = files.map((file) => ({
      file,
      type: file.type.startsWith("video") ? "video" : "image",
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      mediaFiles: [...prev.mediaFiles, ...mapped],
    }));
  };

  const removeMedia = (index) => {
    setFormData((prev) => ({
      ...prev,
      mediaFiles: prev.mediaFiles.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.tweet.length < 1 || formData.tweet.length > 2000) {
      setFormError("Tweet must be between 1 and 2000 characters.");
      return;
    }

    const mediaCount = formData.mediaFiles.length || 0;

    if (
      (user.account.type === "free" ||
        (user.account.type === "premium" &&
          user.account.expiresAt &&
          user.account.expiresAt <= Date.now())) &&
      mediaCount > 3
    ) {
      setFormError(
        "Free users can upload up to 3 media files. Upgrade to premium to add more.",
      );
      return;
    }

    if (user.account.type === "premium" && mediaCount > 5) {
      setFormError("Premium users can upload up to 5 media files per tweet.");
      return;
    }

    const payload = new FormData();
    payload.append("tweet", formData.tweet);
    payload.append("visibility", formData.visibility);

    formData.hashtags.split(",").forEach((tag) => {
      payload.append(
        "hashtags",
        tag.startsWith("#") ? tag.trim() : `#${tag.trim()}`,
      );
    });

    for (let i = 0; i < mediaRef.current.files.length; i++) {
      payload.append("media", mediaRef.current.files[i]);
      console.log(mediaRef.current.files[i]);
    }

    try {
      const serverResponse = await postData(
        `business/${businessInfo?._id}/tweets`,
        payload,
        {
          "Content-Type": "multipart/form-data",
        },
      );

      toast.success(
        serverResponse.data.message || "successfully posted tweet.",
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong please try again.",
      );
    } finally {
      setFormError("");
    }
  };

  return (
    <form className="tweet-form" onSubmit={handleSubmit}>
      <h1>Please post about your business and keep the audience active</h1>

      {/* MEDIA PREVIEW */}
      {formData.mediaFiles.length > 0 && (
        <div className="media-scroll">
          {formData.mediaFiles.map((media, index) => (
            <div className="media-card" key={index}>
              <button
                type="button"
                className="media-delete-btn"
                onClick={() => removeMedia(index)}
                title="delete the media"
              >
                <Trash size={14} />
              </button>

              {media.type === "image" ? (
                <img src={media.preview} alt="preview" />
              ) : (
                <video src={media.preview} controls />
              )}
            </div>
          ))}
        </div>
      )}

      {/* FILE INPUT */}
      <label className="upload-btn">
        Upload image / video
        <input
          type="file"
          hidden
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          ref={mediaRef}
        />
      </label>

      {/* TWEET */}
      <textarea
        name="tweet"
        placeholder="Write your tweet..."
        value={formData.tweet}
        onChange={handleChange}
        maxLength={2000}
        required
      />

      {/* HASHTAGS */}
      <input
        type="text"
        name="hashtags"
        placeholder="Hashtags (comma separated)"
        value={formData.hashtags}
        onChange={handleChange}
      />

      {/* VISIBILITY */}
      <select
        name="visibility"
        value={formData.visibility}
        onChange={handleChange}
      >
        <option value="public">Public</option>
        <option value="followers">Followers</option>
      </select>
      {formError && (
        <div className="Error">
          <CircleX size={14} />
          <span>{formError}</span>
        </div>
      )}

      <button type="submit">
        {loading ? (
          <LoaderCircle className="animate-spin mx-auto" color="white" />
        ) : (
          "Post Tweet"
        )}
      </button>
    </form>
  );
};

export default Tweet;
