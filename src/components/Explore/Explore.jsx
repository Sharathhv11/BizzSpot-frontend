import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Nav2 from "../Home/Util/Nav2";
import useLocation from "@/hooks/useLocation";
import useGet from "@/hooks/useGet";
import { AlertCircle, LoaderCircle } from "lucide-react";
import {
  setExploreFeed,
  addExploreFetchedPage,
  updateExploreFeedPage,
  updateExploreHasMore,
  clearExploreFeed,
} from "./../../redux/reducers/pageState"; // your updated slice path
import "./explore.css";
import BusinessCard from "../Home/Util/BusinessCard";

const LIMIT = 20; // Better UX than 1

const Explore = () => {
  const dispatch = useDispatch();
  const { location, error: locationError } = useLocation();
  const { distance, exploreFeed } = useSelector((state) => state.pageState);
  const { userInfo } = useSelector((state) => state.user);

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  // Clear explore feed when location changes
  useEffect(() => {
    if (location) {
      dispatch(clearExploreFeed());
    }
  }, [location, dispatch]);

  // Only fetch if page NOT already fetched (EXACT Feed pattern)
  const exploreQuery = location
    ? `business/nearBy?latitude=${location.lat}&longitude=${location.lng}&distance=${distance}&limit=${LIMIT}&page=${exploreFeed.page}`
    : null;

  const { data: exploreData, loading: exploreLoading } = useGet(
    location && !exploreFeed.fetchedPages.includes(exploreFeed.page)
      ? exploreQuery
      : null, // CACHE CHECK - exact Feed pattern
  );

  // Handle explore data (EXACT Feed pattern)
  useEffect(() => {
    if (!exploreData) return;

    const businesses = exploreData.data || [];

    if (businesses.length > 0) {
      dispatch(setExploreFeed({ businesses }));
    }


    // decide hasMore and update Redux
    dispatch(updateExploreHasMore(businesses.length === LIMIT));

    // ADD TO CACHE after successful fetch
    dispatch(addExploreFetchedPage(exploreFeed.page));
  }, [exploreData, dispatch, exploreFeed.page]);

  const loadMoreExplore = () => {
    if (!exploreLoading && exploreFeed.hasMore) {
      dispatch(updateExploreFeedPage(exploreFeed.page + 1));
    }
  };

  const EndMessage = () => (
    <div className="empty-feed">
      <h3 className="empty-feed__title">No more businesses nearby</h3>
      <p className="empty-feed__description">
        You've explored all businesses within {distance / 1000}km!
      </p>
    </div>
  );

  return (
    <>
      <Nav2 />
      <section className="business-explore-section">
        {locationError ? (
          <div className="location-error-simple">
            <AlertCircle size={48} className="error-icon-large" />
            <h3>Location Access Needed</h3>
            <p>Enable location to discover businesses nearby you</p>
          </div>
        ) : (
          <div className="explore-business-container">
            <h1>Explore Nearby Businesses</h1>
            <InfiniteScroll
              dataLength={exploreFeed.businesses.length}
              next={loadMoreExplore}
              hasMore={exploreFeed.hasMore}
              loader={
                <div className="h-[50px] w-full grid place-items-center">
                  <LoaderCircle className="animate-spin" />
                </div>
              }
              endMessage={<EndMessage />}
              className="infiniteScroller"
            >
              {exploreFeed.businesses.length === 0 && !exploreFeed.hasMore ? (
                <p>No businesses found nearby</p>
              ) : (
                <div className="business-grid">
                  {exploreFeed.businesses.map((business) => (
                    <BusinessCard
                      business={business}
                      key={business._id}
                      currentPageURL={"/Explore"}
                    />
                  ))}
                </div>
              )}
            </InfiniteScroll>
          </div>
        )}
      </section>
    </>
  );
};

export default Explore;
