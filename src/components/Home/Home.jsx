import useAuthRedirect from "../../hooks/useAuthRedirect";

const Home = () => {

    useAuthRedirect("/");
  return (
    <div>Home</div>
  )
}

export default Home;



