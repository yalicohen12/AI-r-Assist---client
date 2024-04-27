import React, { useEffect } from "react";
import "./App.css";
import ChatPage from "./pages/chat/chatPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/loginModal";
import Signup from "./pages/auth/signupModal";
import FileDrive from "./pages/filesDrive/filesDrive";
import { CSSTransition } from "react-transition-group";
import UserProfile from "./pages/user/userProfile";

function App() {
  // useEffect(() => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <CSSTransition classNames="fade" timeout={600}>
                <ChatPage />
              </CSSTransition>
            }
          ></Route>

          <Route
            path="/Files"
            element={
              <CSSTransition classNames="fade" timeout={600}>
                <FileDrive />
              </CSSTransition>
            }
          ></Route>

          <Route
            path="/User"
            element={
              <CSSTransition classNames="fade" timeout={600}>
                <UserProfile />
              </CSSTransition>
            }
          ></Route>

          {/* <Route path="/login" element={<LoginPage></LoginPage>}></Route> */}

          {/* <Route path="/signup" element= {<Signup></Signup>}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
