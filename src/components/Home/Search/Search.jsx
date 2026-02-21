import React, { useEffect, useState } from "react";
import Nav2 from "../Util/Nav2";
import {
  Search as SearchIcon,
  MapPin,
  Globe,
  AlertCircle,
  LoaderCircle,
  Tag,
} from "lucide-react";

import "./search.css";
import useLocation from "@/hooks/useLocation";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import useGet from "@/hooks/useGet";
import BusinessCard from "../Util/BusinessCard";
import InfiniteScroll from "react-infinite-scroll-component";
import noDP from "./../../../assets/businessNoFound.png";

const LIMIT = 10;

const Search = () => {
  const { userInfo } = useSelector((state) => state.user);
  const { distance, theme } = useSelector((state) => state.pageState);
  if (!userInfo) return <Navigate to="/" />;

  const [canFetch, updateCanFetch] = useState(false);
  const [foundBusiness, updateFoundBusiness] = useState([]);

  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("global");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [displaySearchInfo, updateDisplaySearchInfo] = useState(true);

  const { location, error: locationError } = useLocation();

  const base = "/business?";

  const globalUrl =
    `${base}searchType=GlobalBased` +
    `&query=${encodeURIComponent(searchQuery)}` +
    `&page=${page}&limit=${LIMIT}`;

  const localUrl =
    location &&
    `${base}searchType=LocationBased` +
      `&query=${encodeURIComponent(searchQuery)}` +
      `&longitude=${location.lng}` +
      `&latitude=${location.lat}` +
      `&distance=${distance}` +
      `&page=${page}&limit=${LIMIT}`;

  const { data, loading, error } = useGet(
    canFetch ? (mode === "global" ? globalUrl : localUrl) : null,
  );

  const handleSearch = (e) => {
    e.preventDefault();

    if (!query.trim().length || (mode !== "global" && !location)) return;

    setSearchQuery(query);
    setQuery("");

    updateFoundBusiness([]);
    setPage(1);
    setHasMore(true);
    updateDisplaySearchInfo(false);

    updateCanFetch(true);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
    updateCanFetch(true);
  };

  useEffect(() => {
    if (!data?.data) return;

    updateFoundBusiness((prev) => [...prev, ...data.data]);

    if (data.data.length === 0) {
      setHasMore(false);
    }

    updateCanFetch(false);
  }, [data]);

  return (
    <>
      <Nav2 />

      <section className={`search-page ${theme ? "light" : "dark"}`}>
        <div className="search-container">
          {/* Mode Toggle */}
          <div className="search-toggle">
            <button
              onClick={() => {
                setMode("global");
                updateFoundBusiness([]);
              }}
              className={`toggle-btn ${mode === "global" ? "active" : ""}`}
              title="Search businesses from anywhere (global search)"
            >
              <Globe size={16} />
              Global
            </button>

            <button
              onClick={() => {
                setMode("local");
                updateFoundBusiness([]);
              }}
              className={`toggle-btn ${mode === "local" ? "active" : ""}`}
              title="Search nearby businesses using your current location"
            >
              <MapPin size={16} />
              Local
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="search-form">
            {mode === "local" && (
              <div>
                <MapPin className="location-icon" size={18} />
              </div>
            )}

            <input
              type="text"
              placeholder={`Search ${mode} businesses...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-form-input"
              style={{
                border: "none",
              }}
            />

            <button type="submit" className="search-form-btn">
              <SearchIcon size={18} />
            </button>
          </form>

          {/* Results Placeholder */}
          <div className="search-results">
            {locationError && (
              <div className="location-error-banner">
                <AlertCircle className="error-icon" size={24} />
                <div className="error-content">
                  <h4>Enable Location for Nearby Posts</h4>
                  <p>Turn on location access to discover posts near you.</p>
                </div>
              </div>
            )}

            <InfiniteScroll
              dataLength={foundBusiness.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <>
                  {loading && (
                    <div className="h-[50px] w-full grid place-items-center">
                      <LoaderCircle className="animate-spin" />
                    </div>
                  )}
                </>
              }
              endMessage={
                <>
                  {!displaySearchInfo && (
                    <div className="empty-feed">
                      <h3 className="empty-feed__title">
                        You’ve reached the end of the results
                      </h3>
                      <p className="empty-feed__description">
                        We’ve shown everything matching your search. Try
                        refining your keywords or exploring something new.
                      </p>
                    </div>
                  )}
                </>
              }
              scrollableTarget="scrollableResults"
            >
              <div className="results-grid">
                {foundBusiness.map((bus) => (
                  <BusinessCard
                    key={bus._id}
                    business={bus}
                    currentPageURL={"/Search"}
                  />
                ))}
                {displaySearchInfo && (
                  <div className="search-guide">
                    <span>
                      Search by business name, category, or location (ex: City
                      Bakery, Salon, area).
                    </span>
                  </div>
                )}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </section>
    </>
  );
};

export default Search;
