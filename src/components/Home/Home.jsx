import { useEffect, useState } from "react";
import useAuthRedirect from "../../hooks/useAuthRedirect";
import { useSelector, useDispatch } from "react-redux";

const Home = () => {
  useAuthRedirect();

  const user = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    
  }, [user]);

  return (
    <div>
      <img src={user?.profilePicture} alt="profile" />
      hello here
    </div>
  );
};

export default Home;
