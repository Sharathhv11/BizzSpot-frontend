import React, { useEffect, useState } from "react";
import Follow from "../Util/Follow";
import useGet from "@/hooks/useGet";
import "./followList.css";
import RemoveFollower from "./RemoveFollower";
import { useNavigate } from "react-router-dom";
const FollowList = function ({
  visibility,
  updateVisibility,
  id,
  updateFollowCount,
  owner,
  businessList,
  theme = true,
}) {
  const navigate = useNavigate();
  const [dataList, updateDataList] = useState([]);
  const { data, loading, error } = useGet(id ? `/follow/list?id=${id}` : null);

  useEffect(() => {
    if (data?.data.length) {
      updateDataList(data.data);
    }
  }, [data]);

  const handleNavigateUser = (userId) => {
    updateVisibility(false);
    navigate(`/profile/${userId}`);
  };

  const handleNavigateBusiness = (businessId) => {
    updateVisibility(false);
    navigate(`/business/${businessId}`);
  };

  return (
    <div
      className={`follow-list-modal ${!theme ? "dark" : ""}`}
      style={{
        display: visibility ? "flex" : "none",
        zIndex: 1000,
      }}
    >
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={() => updateVisibility(false)} />

      {/* Center Card */}
      <div className="follow-list-card">
        {/* Header */}
        <div className="follow-header">
          <h3>Following</h3>
          <button onClick={() => updateVisibility(false)} className="close-btn">
            ×
          </button>
        </div>

        {/* Content */}
        <div className="follow-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
            </div>
          ) : error ? (
            <div className="error-state">{error.response.data.message}</div>
          ) : !dataList.length ? (
            <div className="empty-state">No accounts followed</div>
          ) : (
            dataList.map((e) => (
              <div
                key={e._id}
                className="follow-item"
                onClick={() =>
                  e.businessName
                    ? handleNavigateBusiness(e._id)
                    : handleNavigateUser(e._id)
                }
              >
                <div className="follow-information-wrapper">
                  <div className="follow-avatar">
                    <img src={e.profile || e.profilePicture} alt="" />
                  </div>
                  <div className="follow-info">
                    <div>
                      <div className="follow-name">
                        {e.businessName || e.name}
                      </div>
                      <div className="follow-handle">{e.email}</div>
                    </div>
                  </div>
                </div>
                {owner && (
                  <Follow
                    businessID={e._id}
                    updateFollowersCount={updateFollowCount}
                    status={true}
                  />
                )}
                {businessList && (
                  <RemoveFollower
                    updateFollowersCount={updateFollowCount}
                    businessID={id}
                    userID={e._id}
                    updateDataList={updateDataList}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowList;
