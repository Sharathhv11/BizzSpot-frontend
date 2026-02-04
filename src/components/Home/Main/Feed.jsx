import React, { useState, useEffect } from "react";
import "./feed.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setFollowingFeed,
  setForYouFeed,
  updateFollowingFeedPage,
  updateForYouFeedPage,
  updateFollowingHasMore,
  updateForYouHasMore,
} from "./../../../redux/reducers/pageState";
import useGet from "./../../../hooks/useGet";
import TweetCard from "../Util/TweetCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { LoaderCircle } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import noPost from "./../../../assets/no-post.png";

const LIMIT = 1;

const Feed = () => {
  const dispatch = useDispatch();
  const { 
    theme, 
    followingFeed, 
    forYouFeed, 
    distance 
  } = useSelector(
    (state) => state.pageState,
  );

  // false = For You, true = Following
  const [feedType, setFeedType] = useState(false);

  const { location } = useLocation();

  const forYouQuery = `/business/tweets?type=forYou&limit=${LIMIT}&page=${forYouFeed.page}${
    location
      ? `&latitude=${location.lat}&longitude=${location.lng}&distance=${distance}`
      : ""
  }`;

  const { data: forYouData, loading: forYouLoading } = useGet(
    !feedType ? forYouQuery : null,
  );

  useEffect(() => {
    if (!forYouData) return;

    const tweets = forYouData.data || [];

    if (tweets.length > 0) {
      dispatch(setForYouFeed({ tweets }));
    }

    // decide hasMore and update Redux
    dispatch(updateForYouHasMore(tweets.length === LIMIT));
  }, [forYouData, dispatch]);

  const followingQuery = `/business/tweets?type=following&limit=${LIMIT}&page=${followingFeed.page}`;

  const { data: followingData, loading: followingLoading } = useGet(
    feedType ? followingQuery : null,
  );

  useEffect(() => {
    if (!followingData) return;

    const tweets = followingData.data || [];

    if (tweets.length > 0) {
      dispatch(setFollowingFeed({ tweets }));
    }

    // decide hasMore and update Redux
    dispatch(updateFollowingHasMore(tweets.length === LIMIT));
  }, [followingData, dispatch]);

  const loadMoreForYou = () => {
    if (!forYouLoading && forYouFeed.hasMore) {
      dispatch(updateForYouFeedPage(forYouFeed.page + 1));
    }
  };

  const loadMoreFollowing = () => {
    if (!followingLoading && followingFeed.hasMore) {
      dispatch(updateFollowingFeedPage(followingFeed.page + 1));
    }
  };

  return (
    <section className={`feed-section ${!theme ? "feed-section-dark" : ""}`}>
      <div className="feed-section-container">
        {/* Tabs */}
        <div className="feed-meta-container">
          <div
            className={!feedType ? "feed-highlight" : ""}
            onClick={() => setFeedType(false)}
          >
            For you
          </div>
          <div
            className={feedType ? "feed-highlight" : ""}
            onClick={() => setFeedType(true)}
          >
            Following
          </div>
        </div>

        <div className="feed-tweet-container">
          {/* FOR YOU FEED */}
          {!feedType && (
            <InfiniteScroll
              dataLength={forYouFeed.tweets.length}
              next={loadMoreForYou}
              hasMore={forYouFeed.hasMore}
              loader={
                <div className="h-[50px] w-full grid place-items-center">
                  <LoaderCircle className="animate-spin" />
                </div>
              }
              endMessage={
                <div className="empty-feed">
                  <img
                    src={noPost}
                    alt="No posts"
                    className="empty-feed__image"
                  />

                  <h3 className="empty-feed__title">Nothing here yet</h3>

                  <p className="empty-feed__description">
                    Posts will appear here once businesses start sharing
                    updates. Follow businesses or check back later.
                  </p>
                </div>
              }
            >
              {forYouFeed.tweets.map((tweet) => (
                <TweetCard key={tweet._id} tweet={tweet} />
              ))}
            </InfiniteScroll>
          )}

          {/* FOLLOWING FEED */}
          {feedType && (
            <InfiniteScroll
              dataLength={followingFeed.tweets.length}
              next={loadMoreFollowing}
              hasMore={followingFeed.hasMore}
              loader={
                <div className="h-[50px] w-full grid place-items-center">
                  <LoaderCircle className="animate-spin" />
                </div>
              }
              endMessage={
                <div className="empty-feed">
                  <img
                    src={noPost}
                    alt="No posts"
                    className="empty-feed__image"
                  />

                  <h3 className="empty-feed__title">Nothing here yet</h3>

                  <p className="empty-feed__description">
                    Posts will appear here once businesses start sharing
                    updates. Follow businesses or check back later.
                  </p>
                </div>
              }
            >
              {followingFeed.tweets.map((tweet) => (
                <TweetCard key={tweet._id} tweet={tweet} />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </section>
  );
};

export default Feed;
