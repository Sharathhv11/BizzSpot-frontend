import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Protect from "./components/Protect.jsx";
import SignUp from "./components/Auth/SignUp/SignUp.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Protect/>
            }
          ></Route>

           <Route
            path="/login"
            element={
              <SignUp/>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
