import React, { useEffect } from "react";
import "./App.css";
import ChatPage from "./pages/chat/chatPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/loginModal";
import Signup from "./pages/auth/signupModal";

function App() {
  // useEffect(() => {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ChatPage />}></Route>

          {/* <Route path="/login" element={<LoginPage></LoginPage>}></Route> */}

          {/* <Route path="/signup" element= {<Signup></Signup>}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
