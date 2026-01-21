import "./util.css";
import usePost from "../../../hooks/usePost";
import toast from "react-hot-toast";
import useDelete from "../../../hooks/useDelete";
import { useState,useEffect} from "react";

const Follow = ({ businessID, status, updateFollowersCount }) => {
  const { postData, responseData, loading, error } = usePost();
  const { deleteData, loading: delLoading } = useDelete();
  const [disableBtn, setDisableBtn] = useState(false);

  const [followingStatus, setFollowingStatus] = useState(status);

  useEffect(() => {
    if (typeof status === "boolean") {
      setFollowingStatus(status);
    }
  }, [status]);

  const handleFollow = async function () {
    setDisableBtn(true);
    try {
      if (businessID)
        if (!followingStatus) {
          //! means follow must be triggered
          await postData(`/business/${businessID}/follow`, {});
          setFollowingStatus(true);
          updateFollowersCount((prev) => prev + 1);
        } else {
          await deleteData(`/business/${businessID}/follow`, {});
          setFollowingStatus(false);
          updateFollowersCount((prev) => prev - 1);
        }
    } catch (error) {
      toast.error(
        error.response.data.message || "something went wrong please try again.",
      );
    } finally {
      setDisableBtn(false);
    }
  };

  return (
    <button
      className={`follow-business ${disableBtn ? "button-disabled" : null}`}
      onClick={handleFollow}
      disabled={disableBtn}
    >
      {!followingStatus ? "follow" : "unfollow"}
    </button>
  );
};

export default Follow;
