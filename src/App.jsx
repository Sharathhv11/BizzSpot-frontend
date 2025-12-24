import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";
import Login from "./components/Auth/Login/Login.jsx";
import Home from "./components/Home/Home.jsx";
import { Toaster } from 'react-hot-toast';

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

          <Route path="/login"  element={<Login />}>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
