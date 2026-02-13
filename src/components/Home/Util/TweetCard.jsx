import { Avatar } from "@mui/material";
import "./../BusinessProfile/styles/tweet.css";
import {
  Edit3,
  Eye,
  Globe,
  Heart,
  MessageCircle,
  Users,
  Send,
  Trash2,
  MoreVertical,
  LoaderCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useDispatch, useSelector } from "react-redux";
import { pushNav } from "@/redux/reducers/pageState";
import { useNavigate } from "react-router-dom";
import formatCount from "../../../utils/countFormate";
import usePatch from "@/hooks/usePatch";
import useDelete from "@/hooks/useDelete";
import toast from "react-hot-toast";

const TweetCard = ({ tweet, currentPageURL, refreshTweets }) => {
  //* user information
  const { userInfo, usersBusiness } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [likes, setLikes] = useState(0);
  const [likedBefore, setLikedBefore] = useState(false);
  const [disableLikeBtn, setLikeBtnDisable] = useState(false);
  const [showLikesPopup, setShowLikesPopup] = useState(false);
  const [showRepliesPopup, setShowRepliesPopup] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState([]);
  const [disableReplyBtn, setDisableReplyBtn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    tweet: tweet?.tweet || "",
    hashtags: tweet?.hashtags?.join(", ") || "",
    visibility: tweet?.visibility || "public",
    media: tweet?.media || [],
    removedMediaUrls: [],
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { patchData } = usePatch();
  const { deleteData } = useDelete();

  const imageMedia = tweet.media?.filter((m) => m.type === "image") || [];

  const handlePostReply = async function () {
    if (!replyText.trim()) return;
    setDisableReplyBtn(true);
    try {
      const response = await patchData(
        `business/${tweet?.postedBy}/tweet/${tweet?._id}?action=addReply`,
        { comment: replyText },
      );
      setReplies(response?.data?.replies || []);
      setReplyText("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    } finally {
      setDisableReplyBtn(false);
    }
  };

  const handleDeleteTweet = async function () {
    try {
      await deleteData(`business/${tweet?.postedBy._id}/tweet/${tweet?._id}`);
      refreshTweets((prev) => prev + 1);
      toast.success("post deleted successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveMedia = (index) => {
    const media = editFormData.media[index];
    setEditFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index),
      removedMediaUrls: [...prev.removedMediaUrls, media.url],
    }));
  };

  const handleUpdateTweet = async function () {
    if (!editFormData.tweet.trim()) {
      toast.error("Tweet cannot be empty.");
      return;
    }

    setIsUpdating(true);
    try {
      await patchData(`business/${tweet?.postedBy._id}/tweet/${tweet?._id}`, {
        tweet: editFormData.tweet.trim(),
        hashtags: editFormData.hashtags
          .split(",")
          .filter((tag) => tag.trim())
          .map((tag) =>
            tag.trim().startsWith("#") ? tag.trim() : `#${tag.trim()}`,
          ),
        visibility: editFormData.visibility,
        removedMedia: editFormData.removedMediaUrls,
      });
      toast.success("Tweet updated successfully.");
      setShowEditModal(false);
      refreshTweets((prev) => prev + 1);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update tweet.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReply = async function (replyId) {
    try {
      const response = await patchData(
        `business/${tweet?.postedBy}/tweet/${tweet?._id}?action=deleteReply&replyId=${replyId}`,
        {},
      );
      setReplies(response?.data?.replies || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    }
  };

  const handleLike = async function () {
    setLikeBtnDisable(true);
    try {
      //*patch data
      await patchData(`business/${tweet?.postedBy}/tweet/${tweet?._id}`, {
        like: userInfo?.id,
      });
      setLikes((prev) => prev + (likedBefore ? -1 : 1));
      setLikedBefore((prev) => !prev);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to send reset link. Please try again.",
      );
    } finally {
      setLikeBtnDisable(false);
    }
  };

  useEffect(() => {
    const liked = tweet?.likes?.some((l) => l._id === userInfo?.id) || false;

    setLikedBefore(liked);
    setLikes(tweet?.likes?.length || 0);
    setReplies(tweet?.replies || []);
  }, [tweet, userInfo]);

  return (
    <>
      <article key={tweet._id} className="tweet-card">
        {/* Header */}
        <header className="tweet-header">
          <div>
            <div
              className="tweet-owner-info"
              onClick={() => {
                if (!currentPageURL) return;
                dispatch(pushNav(currentPageURL));
                navigate(`/business/${tweet.postedBy._id}`);
              }}
            >
              <Avatar
                src={tweet.postedBy.profile}
                alt="Owner"
                sx={{ width: 28, height: 28, pointerEvents: "none" }}
              />
              <div>
                <h4 className="tweet-user">{tweet.postedBy.businessName}</h4>
                <h6>{tweet.postedBy.email}</h6>
              </div>
            </div>
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
            {usersBusiness.some(({ _id }) => _id === tweet?.postedBy?._id) && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 hover:bg-gray-200 rounded-full transition cursor-pointer"
                  title="More options"
                >
                  <MoreVertical size={16} />
                </button>
                {showMenu && (
                  <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-40">
                    <button
                      onClick={() => {
                        setShowEditModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-blue-500 hover:bg-blue-50 transition flex items-center gap-2 rounded-t-lg cursor-pointer"
                      style={{ padding: "8px 12px" }}
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteTweet();
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 transition flex items-center gap-2 rounded-b-lg cursor-pointer"
                      style={{ padding: "8px 12px" }}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <p className="tweet-text">{tweet.tweet}</p>

        {/* Media (clickable like Twitter) */}
        {imageMedia.length > 0 && (
          <div
            className={`tweet-media twitter-layout media-${Math.min(
              imageMedia.length,
              4,
            )}`}
          >
            {imageMedia.slice(0, 4).map((media, index) => (
              <div key={index} className="media-item">
                <img
                  src={media.url}
                  alt="tweet media"
                  loading="lazy"
                  onClick={() => {
                    setActiveIndex(index);
                    setOpen(true);
                  }}
                  style={{ cursor: "pointer" }}
                />
              </div>
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
          <button disabled={disableLikeBtn} onClick={handleLike}>
            <Heart
              size={18}
              fill={likedBefore ? "red" : "transparent"}
              strokeWidth={likedBefore ? 0 : 2}
            />
            <span
              onClick={(e) => {
                e.stopPropagation();
                setShowLikesPopup(true);
              }}
              style={{ cursor: "pointer" }}
            >
              {formatCount(likes)}
            </span>
          </button>

          <button onClick={() => setShowRepliesPopup(true)}>
            <MessageCircle size={18} />
            <span>{replies.length}</span>
          </button>
        </footer>
      </article>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="
      w-[calc(100vw-40px)]
      max-w-5xl
      h-[50vh]
      p-0
      bg-black
      rounded-xl
      shadow-2xl
      overflow-hidden
      sm:w-[calc(100vw-40px)]
      md:w-[90vw]
      lg:w-[70vw]
    "
        >
          <Carousel className="w-full h-full">
            <CarouselContent className="h-full">
              {imageMedia.map((media, i) => (
                <CarouselItem key={i} className="basis-full w-full h-full">
                  <img
                    src={media.url}
                    alt=""
                    className="
                w-full 
                h-full 
                object-cover
                select-none
              "
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-3 bg-black/60 text-white hover:bg-black/80" />
            <CarouselNext className="right-3 bg-black/60 text-white hover:bg-black/80" />
          </Carousel>
        </DialogContent>
      </Dialog>

      {/* Likes Popup */}
      {showLikesPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 ">
          <div
            className="
        w-96
        bg-white
        rounded-xl
        shadow-2xl
        flex flex-col
        max-h-[480px]
        overflow-hidden
      "
            style={{
              padding: "6px",
            }}
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-5 p-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Heart size={20} className="text-red-500 fill-red-500" />
                Liked by {formatCount(likes)}
              </h3>
            </div>

            {/* Scroll body */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {tweet.likes && tweet.likes.length > 0 ? (
                <div
                  className="space-y-2 flex flex-col gap-3"
                  style={{ padding: "3px" }}
                >
                  {tweet.likes.map((user) => (
                    <div
                      key={user._id}
                      className="
                  flex items-center gap-3
                  p-2.5
                  rounded-lg
                  hover:bg-gray-50
                  cursor-pointer
                  transition
                "
                      onClick={() => {
                        setShowLikesPopup(false);
                        dispatch(pushNav(currentPageURL));
                        navigate(`/profile/${user._id}`);
                      }}
                    >
                      <Avatar
                        src={user.profilePicture}
                        alt={user.username}
                        sx={{ width: 40, height: 40, flexShrink: 0 }}
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No likes yet</p>
              )}
            </div>

            {/* Close click area */}
            <button
              className="absolute inset-0 -z-10"
              onClick={() => setShowLikesPopup(false)}
            />
          </div>
        </div>
      )}

      {/* Replies Popup */}
      {showRepliesPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="
        w-96
        bg-white
        rounded-xl
        shadow-2xl
        flex flex-col
        max-h-[600px]
        overflow-hidden
      "
            style={{ padding: "8px" }}
          >
            {/* Header */}
            <div className="border-b border-gray-200 px-5 p-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageCircle size={20} className="text-blue-500" />
                Replies ({formatCount(replies.length)})
              </h3>
            </div>

            {/* Scroll body */}
            <div className="flex-1 overflow-y-auto px-5 py-3">
              {replies && replies.length > 0 ? (
                <div className="space-y-4 flex flex-col gap-1.5 h-[300px]">
                  {replies.map((reply) => (
                    <div
                      key={reply._id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                      style={{
                        padding: "5px",
                      }}
                    >
                      {/* Reply Header */}
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar
                          src={
                            reply.userId?.profilePicture ||
                            reply.userId?.profile
                          }
                          alt={
                            reply.userId?.username || reply.userId?.firstName
                          }
                          sx={{ width: 40, height: 40, flexShrink: 0 }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div
                              className="cursor-pointer hover:underline flex-1"
                              onClick={() => {
                                setShowRepliesPopup(false);
                                dispatch(pushNav(currentPageURL));
                                navigate(`/profile/${reply.userId?._id}`);
                              }}
                            >
                              <p className="font-semibold text-sm truncate">
                                {reply.userId?.username ||
                                  reply.userId?.firstName}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {reply.userId?.email}
                              </p>
                            </div>
                            {reply.userId?._id === userInfo?.id && (
                              <button
                                onClick={() => handleDeleteReply(reply._id)}
                                className="p-1 hover:bg-red-50 rounded-lg transition text-red-500 hover:text-red-600"
                                title="Delete reply"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reply Comment */}
                      <p className="text-sm break-word ml-11">
                        {reply.comment}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {reply.createdAt
                          ? new Date(reply.createdAt).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No replies yet</p>
              )}
            </div>

            {/* Reply Input Form */}
            <div className="border-t border-gray-200 px-5 py-4 bg-gray-50">
              <div className="flex gap-3 items-end">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !disableReplyBtn) {
                      handlePostReply();
                    }
                  }}
                  placeholder="Write a reply..."
                  className="
                flex-1
                px-4 py-2.5
                border border-gray-300
                rounded-lg
                text-sm
                transition
              "
                />
                <button
                  onClick={handlePostReply}
                  disabled={disableReplyBtn || !replyText.trim()}
                  className="
              
              bg-blue-500
              w-[50px]
              h-[45px]
              hover:bg-blue-600
              disabled:bg-blue-500
              disabled:cursor-not-allowed
              cursor-pointer
              text-white
              rounded
              transition
              flex items-center justify-center
            "
                  style={{
                    padding: "2.5px",
                  }}
                  title="Post reply"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>

            {/* Close click area */}
            <button
              className="absolute inset-0 -z-10"
              onClick={() => setShowRepliesPopup(false)}
            />
          </div>
        </div>
      )}

      {/* Edit Tweet Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            style={{ padding: 12, margin: "20px" }}
          >
            {/* Header */}
            <div
              className="border-b border-gray-200"
              style={{ padding: "16px 20px", marginBottom: 4 }}
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Edit3 size={20} /> Edit Tweet
              </h2>
            </div>

            {/* Scroll body */}
            <div
              className="flex-1 overflow-y-auto"
              style={{
                padding: "16px 20px",
                display: "flex",
                flexDirection: "column",
                gap: 20,
              }}
            >
              {/* Tweet */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="text-sm font-medium">Tweet</label>

                <textarea
                  name="tweet"
                  value={editFormData.tweet}
                  onChange={handleEditChange}
                  maxLength={2000}
                  rows="6"
                  placeholder="Write your tweet..."
                  className="
    w-full
    rounded-lg
    text-sm
    resize-none
  "
                  style={{ padding: "12px 14px", border: "1px solid #d1d5dc" }}
                />

                <p className="text-xs text-gray-500">
                  {editFormData.tweet.length}/2000
                </p>
              </div>

              {/* Hashtags */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="text-sm font-medium">Hashtags</label>

                <input
                  type="text"
                  name="hashtags"
                  value={editFormData.hashtags}
                  onChange={handleEditChange}
                  placeholder="Hashtags (comma separated)"
                  className="w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  style={{ padding: "10px 14px" }}
                />
              </div>

              {/* Visibility */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label className="text-sm font-medium">Visibility</label>

                <select
                  name="visibility"
                  value={editFormData.visibility}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-lg text-sm "
                  style={{ padding: "10px 14px" }}
                >
                  <option value="public">Public</option>
                  <option value="followers">Followers</option>
                </select>
              </div>

              {/* Media */}
              {editFormData.media.length > 0 && (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <label className="text-sm font-medium">Media</label>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {editFormData.media.map((media, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {media.type === "image" ||
                          media.url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                            <img
                              src={media.url}
                              alt="media"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={media.url}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <button
                          onClick={() => handleRemoveMedia(index)}
                          type="button"
                          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-lg"
                        >
                          <Trash2 size={20} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              className="border-t border-gray-200 bg-gray-50 flex gap-3 justify-center"
              style={{ padding: "14px 20px", marginTop: 4 }}
            >
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditFormData({
                    tweet: tweet?.tweet || "",
                    hashtags: tweet?.hashtags?.join(", ") || "",
                    visibility: tweet?.visibility || "public",
                    media: tweet?.media || [],
                    removedMediaUrls: [],
                  });
                }}
                disabled={isUpdating}
                className="border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ padding: "8px 16px" }}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateTweet}
                disabled={isUpdating}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ padding: "8px 16px" }}
              >
                {isUpdating ? <LoaderCircle /> : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TweetCard;
