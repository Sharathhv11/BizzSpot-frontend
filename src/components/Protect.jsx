import useAuthRedirect from "../hooks/useAuthRedirect";
const Protect = ({children}) => {

    useAuthRedirect();
 
    const token = localStorage.getItem("token");
 
    if(!token){
        return <h1>Hello this is inner</h1>;
    }else{
        //redirect to login page
    }
}
export default Protect;