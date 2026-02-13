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
  addForYouFetchedPage,
  addFollowingFetchedPage,
} from "./../../../redux/reducers/pageState";
import useGet from "./../../../hooks/useGet";
import TweetCard from "../Util/TweetCard";
import InfiniteScroll from "react-infinite-scroll-component";
import useLocation from "@/hooks/useLocation";
import noPost from "./../../../assets/no-post.png";

import {
  AlertCircle,
  RefreshCw,
  Settings,
  MapPin,
  LoaderCircle,
} from "lucide-react";

const LIMIT = 10;

const Feed = () => {
  const dispatch = useDispatch();
  const { theme, followingFeed, forYouFeed, distance } = useSelector(
    (state) => state.pageState,
  );

  // false = For You, true = Following
  const [feedType, setFeedType] = useState(false);

  const { location, error: locationError, canFetch } = useLocation();
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationRetryCount, setLocationRetryCount] = useState(0);

  //  Only fetch if page NOT already fetched
  const forYouQuery = `/business/tweets?type=forYou&limit=${LIMIT}&page=${forYouFeed.page}${`&latitude=${location?.lat || null}&longitude=${location?.lng || null}&distance=${distance}`}`;

  const { data: forYouData, loading: forYouLoading } = useGet(
    !feedType && !forYouFeed.fetchedPages.includes(forYouFeed.page) && canFetch
      ? forYouQuery
      : null, // CACHE CHECK
  );

  useEffect(() => {
    if (!forYouData) return;

    const tweets = forYouData.data || [];

    if (tweets.length > 0) {
      dispatch(setForYouFeed({ tweets }));
    }

    // decide hasMore and update Redux
    dispatch(updateForYouHasMore(tweets.length === LIMIT));

    // ADD TO CACHE after successful fetch
    dispatch(addForYouFetchedPage(forYouFeed.page));
  }, [forYouData, dispatch, forYouFeed.page]);

  const followingQuery = `/business/tweets?type=following&limit=${LIMIT}&page=${followingFeed.page}`;

  const { data: followingData, loading: followingLoading } = useGet(
    feedType && !followingFeed.fetchedPages.includes(followingFeed.page)
      ? followingQuery
      : null, //  CACHE CHECK
  );

  useEffect(() => {
    if (!followingData) return;

    const tweets = followingData.data || [];

    if (tweets.length > 0) {
      dispatch(setFollowingFeed({ tweets }));
    }

    // decide hasMore and update Redux
    dispatch(updateFollowingHasMore(tweets.length === LIMIT));

    //  ADD TO CACHE after successful fetch
    dispatch(addFollowingFetchedPage(followingFeed.page));
  }, [followingData, dispatch, followingFeed.page]);

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

  const EndMessage = () => {
    return (
      <div className="empty-feed">
        <img src={noPost} alt="No posts" className="empty-feed__image" />

        <h3 className="empty-feed__title">Nothing here yet</h3>

        <p className="empty-feed__description">
          Posts will appear here once businesses start sharing updates. Follow
          businesses or check back later.
        </p>
      </div>
    );
  };

  return (
    <section className={`feed-section ${!theme ? "feed-section-dark" : ""}`}>
      <div className="feed-section-container">
        {/* Tabs */}
        <div className="feed-meta-container">
          <div
            className={!feedType ? "feed-highlight" : ""}
            onClick={() => {
              setFeedType(false);
            }}
          >
            For you
          </div>
          <div
            className={feedType ? "feed-highlight" : ""}
            onClick={() => {
              setFeedType(true);
            }}
          >
            Following
          </div>
        </div>

        <div className="feed-tweet-container">
          {/* FOR YOU FEED */}
          {!feedType && (
            <>
              {locationError && (
                <div className="location-error-banner">
                  <AlertCircle className="error-icon text-red-500" size={24} />

                  <div className="error-content">
                    <h4>Enable Location for Nearby Posts</h4>
                    <p>
                      Turn on location access to discover posts from businesses
                      near you. You'll still see interest-based recommendations.
                    </p>
                  </div>
                </div>
              )}

              <InfiniteScroll
                dataLength={forYouFeed.tweets.length}
                next={loadMoreForYou}
                hasMore={forYouFeed.hasMore}
                loader={
                  <div className="h-[50px] w-full grid place-items-center">
                    <LoaderCircle className="animate-spin" />
                  </div>
                }
                endMessage={<EndMessage />}
                style={{
                  minHeight: "300px",
                }}
              >
                {forYouFeed.tweets.map((tweet) => (
                  <TweetCard
                    key={`for-you-${tweet._id}`}
                    tweet={tweet}
                    currentPageURL="/"
                  />
                ))}
              </InfiniteScroll>
            </>
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
              endMessage={<EndMessage />}
            >
              {followingFeed.tweets.map((tweet) => (
                <TweetCard
                  key={`following-${tweet._id}`}
                  tweet={tweet}
                  currentPageURL="/"
                />
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </section>
  );
};

export default Feed;
