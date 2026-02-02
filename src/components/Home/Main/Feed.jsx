import React, { useState, useEffect } from "react";
import "./feed.css";
import { useSelector } from "react-redux";
import useGet from "./../../../hooks/useGet";
import { Navigate, useNavigate } from "react-router-dom";
import TweetCard from "../Util/TweetCard";

const Feed = () => {
  const [feedType, setFeedType] = useState(false); //* false = for you and true = following
  const { theme } = useSelector((state) => state.pageState);
  const [tweets, setTweets] = useState([]);

  const { data, loading, error } = useGet("/business/tweets?type=following");

  useEffect(() => {
    if (data) {
      setTweets(data.data);
    }
  }, [data]);

  return (
    <section className={`feed-section ${!theme ? "feed-section-dark" : null}`}>
      <div className="feed-section-container">
        <div className="feed-meta-container">
          <div
            className={`${!feedType ? "feed-highlight" : null}`}
            onClick={() => {
              setFeedType(false);
            }}
          >
            For you
          </div>
          <div
            className={`${feedType ? "feed-highlight" : null}`}
            onClick={() => {
              setFeedType(true);
            }}
          >
            Following
          </div>
        </div>
        <div className="feed-tweet-container">
          {tweets.length &&
            tweets.map((tweet) => <TweetCard tweet={tweet} key={tweet._id} />)}
        </div>
      </div>
    </section>
  );
};

export default Feed;
