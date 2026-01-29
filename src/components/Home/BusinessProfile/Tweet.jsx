import "./styles/tweet.css";

import { useRef, useState } from "react";
import { CircleX, LoaderCircle, Trash } from "lucide-react";
import usePost from "./../../../hooks/usePost";
import { Heart, MessageCircle, Eye, Edit3, Globe, Users } from "lucide-react";
import { useSelector } from "react-redux";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import toast from "react-hot-toast";

const Tweet = ({ owned, businessInfo }) => {
  const tweets = [
    {
      postedBy: "business_01",
      tweet: "Launching our new product this week 🚀 Stay tuned!",
      media: [{ url: "https://picsum.photos/400/300?1", type: "image" }],
      hashtags: ["#launch", "#startup", "#tech"],
      likes: ["user_1", "user_2"],
      views: 120,
      replies: [],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-10T10:15:00Z",
    },
    {
      postedBy: "business_02",
      tweet: "Customer feedback helps us grow. Thanks for the love ❤️",
      media: [],
      hashtags: ["#customers", "#feedback"],
      likes: ["user_3"],
      views: 95,
      replies: [
        {
          userId: "user_4",
          comment: "Well deserved 👏",
          createdAt: "2025-01-10T11:00:00Z",
        },
      ],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-10T10:45:00Z",
    },
    {
      postedBy: "business_03",
      tweet: "Behind the scenes of our development process.",
      media: [{ url: "https://picsum.photos/400/300?2", type: "video" }],
      hashtags: ["#development", "#bts"],
      likes: [],
      views: 210,
      replies: [],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-11T09:30:00Z",
    },
    {
      postedBy: "business_04",
      tweet: "We’re hiring! Join our growing team.",
      media: [],
      hashtags: ["#hiring", "#jobs"],
      likes: ["user_1", "user_5", "user_6"],
      views: 340,
      replies: [],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-11T12:00:00Z",
    },
    {
      postedBy: "business_05",
      tweet: "Product update v2.1 is live 🎉",
      media: [{ url: "https://picsum.photos/400/300?3", type: "image" }],
      hashtags: ["#update", "#product"],
      likes: ["user_7"],
      views: 180,
      replies: [],
      visibility: "followers",
      edited: true,
      createdAt: "2025-01-12T08:20:00Z",
    },
    {
      postedBy: "business_06",
      tweet: "Monday motivation: keep building 💪",
      media: [],
      hashtags: ["#motivation"],
      likes: [],
      views: 60,
      replies: [],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-12T09:00:00Z",
    },
    {
      postedBy: "business_07",
      tweet: "Our servers are faster than ever ⚡",
      media: [],
      hashtags: ["#performance", "#tech"],
      likes: ["user_8"],
      views: 145,
      replies: [],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-13T10:10:00Z",
    },
    {
      postedBy: "business_08",
      tweet: "Thanks for 10k followers! 🎉",
      media: [{ url: "https://picsum.photos/400/300?4", type: "image" }],
      hashtags: ["#milestone"],
      likes: ["user_1", "user_2", "user_3"],
      views: 500,
      replies: [],
      visibility: "public",
      edited: false,
      createdAt: "2025-01-14T14:30:00Z",
    },
    {
      postedBy: "business_09",
      tweet: "We fixed the login issue. Sorry for the inconvenience.",
      media: [],
      hashtags: ["#bugfix"],
      likes: [],
      views: 220,
      replies: [
        {
          userId: "user_9",
          comment: "Thanks for the quick fix!",
          createdAt: "2025-01-14T15:00:00Z",
        },
      ],
      visibility: "public",
      edited: true,
      createdAt: "2025-01-14T14:45:00Z",
    },
    {
      postedBy: "business_10",
      tweet: "Sneak peek of our upcoming feature 👀",
      media: [{ url: "https://picsum.photos/400/300?5", type: "image" }],
      hashtags: ["#comingsoon"],
      likes: ["user_10"],
      views: 310,
      replies: [],
      visibility: "followers",
      edited: false,
      createdAt: "2025-01-15T09:00:00Z",
    },

    {
      postedBy: "business_11",
      tweet: "New partnership announcement soon 🤝",
      media: [],
      hashtags: ["#partnership"],
      likes: [],
      views: 80,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_12",
      tweet: "We love open source ❤️",
      media: [],
      hashtags: ["#opensource"],
      likes: ["user_2"],
      views: 150,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_13",
      tweet: "Security update deployed successfully 🔐",
      media: [],
      hashtags: ["#security"],
      likes: [],
      views: 200,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_14",
      tweet: "UI refresh coming next week 🎨",
      media: [],
      hashtags: ["#uiux"],
      likes: [],
      views: 170,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_15",
      tweet: "Customer support available 24/7 ⏰",
      media: [],
      hashtags: ["#support"],
      likes: [],
      views: 90,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_16",
      tweet: "We’re scaling up our infrastructure 📈",
      media: [],
      hashtags: ["#scaling"],
      likes: [],
      views: 260,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_17",
      tweet: "Thank you for your trust 🙏",
      media: [],
      hashtags: ["#gratitude"],
      likes: [],
      views: 110,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_18",
      tweet: "Our API docs are now live 📚",
      media: [],
      hashtags: ["#api"],
      likes: [],
      views: 300,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_19",
      tweet: "Weekend maintenance scheduled 🛠️",
      media: [],
      hashtags: ["#maintenance"],
      likes: [],
      views: 75,
      replies: [],
      visibility: "public",
      edited: false,
    },
    {
      postedBy: "business_20",
      tweet: "Big things coming in 2025 🚀",
      media: [],
      hashtags: ["#future"],
      likes: ["user_1"],
      views: 420,
      replies: [],
      visibility: "public",
      edited: false,
    },
  ];

  return (
    <>
      <section className="tweet-section">
        {tweets.map((tweet, index) => (
          <article key={index} className="tweet-card">
            {/* Header */}
            <header className="tweet-header">
              <div>
                <h4 className="tweet-user">{tweet.postedBy}</h4>
                <span className="tweet-time">
                  {tweet.createdAt
                    ? new Date(tweet.createdAt).toLocaleString()
                    : "Just now"}
                </span>
              </div>

              <div className="tweet-meta">
                {tweet.visibility === "public" ? (
                  <Globe size={16} />
                ) : (
                  <Users size={16} />
                )}
                {tweet.edited && (
                  <span className="edited-badge">
                    <Edit3 size={14} /> Edited
                  </span>
                )}
              </div>
            </header>

            {/* Content */}
            <p className="tweet-text">{tweet.tweet}</p>

            {/* Media */}
            {/* Media */}
            {tweet.media?.length > 0 && (
              <div className="tweet-media">
                {/* Images */}
                {tweet.media.filter((m) => m.type === "image").length > 0 && (
                  <ImageList
                    cols={
                      tweet.media.filter((m) => m.type === "image").length === 1
                        ? 1
                        : 2
                    }
                    gap={8}
                    sx={{ borderRadius: "12px", overflow: "hidden" }}
                  >
                    {tweet.media
                      .filter((m) => m.type === "image")
                      .map((m, i) => (
                        <ImageListItem key={i}>
                          <img
                            src={m.url}
                            alt="tweet"
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                        </ImageListItem>
                      ))}
                  </ImageList>
                )}

                {/* Videos */}
                {tweet.media
                  .filter((m) => m.type === "video")
                  .map((m, i) => (
                    <video
                      key={i}
                      src={m.url}
                      controls
                      style={{
                        width: "100%",
                        marginTop: "8px",
                        borderRadius: "12px",
                      }}
                    />
                  ))}
              </div>
            )}

            {/* Hashtags */}
            {tweet.hashtags?.length > 0 && (
              <div className="tweet-tags">
                {tweet.hashtags.map((tag, i) => (
                  <span key={i}>{tag}</span>
                ))}
              </div>
            )}

            {/* Actions */}
            <footer className="tweet-actions">
              <button>
                <Heart size={18} />
                <span>{tweet.likes.length}</span>
              </button>

              <button>
                <MessageCircle size={18} />
                <span>{tweet.replies.length}</span>
              </button>

              <div className="views">
                <Eye size={18} />
                <span>{tweet.views}</span>
              </div>
            </footer>

            {/* Replies */}
            {tweet.replies.length > 0 && (
              <div className="tweet-replies">
                {tweet.replies.map((reply, i) => (
                  <div key={i} className="reply">
                    <strong>{reply.userId}</strong>
                    <p>{reply.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      {owned && <TweetForm businessInfo={businessInfo} />}
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
      console.log( mediaRef.current.files[i])
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
