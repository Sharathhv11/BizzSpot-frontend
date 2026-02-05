// RemoveFollower.jsx - FIXED with local dataList update
import "./util.css";
import useDelete from "../../../hooks/useDelete";
import toast from "react-hot-toast";
import { useState } from "react";

const RemoveFollower = ({ businessID, userID, updateFollowersCount, updateDataList }) => {
  const { deleteData, loading } = useDelete();
  const [disableBtn, setDisableBtn] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleRemoveFollower = async function () {
    setDisableBtn(true);
    setRemoving(true);

    try {
      if (businessID && userID) {
        await deleteData(`/business/${businessID}/follower/${userID}`, {});
        
        updateDataList((prevList) => 
          prevList.filter((business) => business._id !== userID)
        );
        
        updateFollowersCount((prev) => prev - 1);
        toast.success("Follower removed successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to remove follower. Please try again."
      );
     
    } finally {
      setDisableBtn(false);
      setRemoving(false);
    }
  };

  return (
    <button
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 min-h-[34px] ${
        removing || disableBtn
          ? "bg-red-200 text-red-500 border border-red-300 cursor-not-allowed"
          : "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow-md active:scale-[0.98]"
      }`}
      onClick={handleRemoveFollower}
      disabled={disableBtn}
    >
      {removing && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      <span>{removing ? "Removing..." : "Remove"}</span>
    </button>
  );
};

export default RemoveFollower;
