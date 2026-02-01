import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";
import Login from "./components/Auth/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";
import CompleteProfile from "./components/Auth/SignUp/CompleteProfile.jsx";
import Profile from "./components/Home/Profile/Profile.jsx";
import { Toaster } from 'react-hot-toast';
import { ForgotPassword } from "./components/Auth/Login/ForgotPassword.jsx";
import BusinessRegistration from "./components/Home/Business/BusinessRegistration.jsx";
import 'leaflet/dist/leaflet.css';
import BusinessProfile from "./components/Home/BusinessProfile/BusinessProfile.jsx";
import Subscription from "./components/paymentGateWay/Subscription.jsx";
import About from "./components/About/About";

function App() {
  
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />  
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Home/>
            }
          ></Route>

           <Route
            path="/sign-up"  
            element={
              <SignUp/>
            }
          ></Route>

          <Route path="/login"  element={<Login />}></Route>
          <Route path="/complete-profile" element={<CompleteProfile/>}></Route>
          <Route
            path="/forgot-password"
            element={
              <ForgotPassword/>
            }
          ></Route>
          <Route path="/profile/:userID" element={<Profile/>}></Route>
          <Route path="/register-business" element={<BusinessRegistration/>}/>
          <Route path="/business/:businessID" element={<BusinessProfile/>}/>
          <Route path="/payment" element={<Subscription/>}/>
          <Route path="/About" element={<About/>}/>
        </Routes>
      </BrowserRouter>
      
    </>
  );
}

export default App;
