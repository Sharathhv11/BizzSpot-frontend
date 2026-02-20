import React, { useEffect, useState } from "react";
import Nav2 from "../Home/Util/Nav2";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import useGet from "../../hooks/useGet";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Users, Eye, FileText, TrendingUp, TrendingDown, LoaderCircle } from "lucide-react";

const Analytics = () => {
  const { userInfo, usersBusiness } = useSelector((state) => state.user);
  const { businessID } = useParams();
  const navigate = useNavigate();

  const [businessId, setBusinessId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  if (!userInfo) return <Navigate to="/" />;

  useEffect(() => {
    if (userInfo.account.type === "free") {
      toast.error("Premium required");
      navigate("/payment");
      return;
    }

    if (usersBusiness?.length) {
      const business = usersBusiness.find((b) => b._id === businessID);
      setBusinessId(business?._id);
    }
  }, [userInfo, usersBusiness, businessID]);

  const { data: analyticsData, loading } = useGet(
    businessId ? `/analytics/${businessId}?type=${activeTab}` : null,
    [activeTab, businessId]
  );

  const data = analyticsData?.data;

  return (
    <>
      <Nav2 />
      <div className="min-h-screen bg-white text-black px-4 md:px-8 py-8 w-full max-w-[1200px] chart-container" style={{
        margin:"10px auto",
        padding:"20px"
      }}>
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <h1 className="text-3xl md:text-4xl font-semibold">Analytics</h1>
          <p className="text-gray-500 mb-8">
            Track your business performance
          </p>

          {/* TABS */}
          <div className="flex flex-wrap gap-4 border-b mb-8" style={{
            margin:"10px 5px"
          }}>
            {["overview", "followers", "profile-views", "posts"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 capitalize text-sm md:text-base cursor-pointer ${
                  activeTab === tab
                    ? "border-b-2 border-black font-semibold"
                    : "text-gray-500"
                }`}
              >
                {tab.replace("-", " ")}
              </button>
            ))}
          </div>

          {loading &&  <LoaderCircle className="spinner" />}

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div style={{
              margin:"10px"
            }}>
            <CardGrid >
              <MetricCard label="Followers" value={data?.totalFollowers} icon={<Users />} />
              <MetricCard label="Profile Views" value={data?.totalProfileViews} icon={<Eye />} />
              <MetricCard label="Posts" value={data?.totalPosts} icon={<FileText />} />
              <MetricCard label="Avg Views/Post" value={data?.averageViewsPerPost} icon={<TrendingUp />} />
            </CardGrid>
            </div>
          )}

          {/* FOLLOWERS */}
          {activeTab === "followers" && (
            <>
              <CardGrid>
                <MetricCard label="Total" value={data?.totalFollowers} icon={<Users />} />
                <MetricCard label="Gained" value={data?.summary?.gain} icon={<TrendingUp />} />
                <MetricCard label="Lost" value={data?.summary?.loss} icon={<TrendingDown />} />
                <MetricCard label="Net" value={data?.summary?.netChange} icon={<TrendingUp />} />
              </CardGrid>

              <ChartCard title="Follower Growth">
                <LineChart data={data?.history || []}>
                  <CartesianGrid stroke="#e5e7eb" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="countChange" stroke="#000" strokeWidth={2} />
                </LineChart>
              </ChartCard>
            </>
          )}

          {/* PROFILE VIEWS */}
          {activeTab === "profile-views" && (
            <ChartCard title="Daily Profile Views">
              <LineChart data={data?.viewsByDate || []}>
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#000" strokeWidth={2} />
              </LineChart>
            </ChartCard>
          )}

          {/* POSTS */}
          {activeTab === "posts" && (
            <ChartCard title="Top Posts">
              <BarChart data={data?.topPosts || []}>
                <CartesianGrid stroke="#e5e7eb" />
                <XAxis dataKey="postId" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalViews" fill="#000" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartCard>
          )}
        </div>
      </div>
    </>
  );
};

const CardGrid = ({ children }) => (
  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8" >
    {children}
  </div>
);

const MetricCard = ({ label, value, icon }) => (
  <div className="border rounded-xl p-5 flex justify-between items-center" style={{
    padding:"10px",
    margin:"10px 5px"
  }}>
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <h2 className="text-2xl font-semibold">
        {typeof value === "number" ? value.toLocaleString() : value || 0}
      </h2>
    </div>
    <div className="text-gray-400">{icon}</div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="border rounded-xl p-5 h-[350px]" style={{
    padding:"10px"
  }}>
    <h2 className="mb-4 font-semibold">{title}</h2>
    <ResponsiveContainer width="100%" height="100%">
      {children}
    </ResponsiveContainer>
  </div>
);

export default Analytics;