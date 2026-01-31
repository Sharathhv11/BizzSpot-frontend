import { Avatar } from "@mui/material";
import "./../BusinessProfile/styles/tweet.css";
import { Edit3, Eye, Globe, Heart, MessageCircle, Users } from "lucide-react";
import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TweetCard = ({ tweet }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const imageMedia = tweet.media?.filter((m) => m.type === "image") || [];

  return (
    <>
      <article key={tweet._id} className="tweet-card">
        {/* Header */}
        <header className="tweet-header">
          <div>
            <div className="tweet-owner-info">
              <Avatar
                src={tweet.postedBy.profile}
                alt="Owner"
                sx={{ width: 28, height: 28 }}
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
          <CarouselItem
            key={i}
            className="basis-full w-full h-full"
          >
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


    </>
  );
};

export default TweetCard;
