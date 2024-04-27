import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { useAppSelector } from "../../state";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

function LoginIndicator() {
  const authStatus = useAppSelector((state) => state.authSlice.isAuth);

  return (
    <div className="logindicator">
      <IconButton className="icon">
        {authStatus && (
          <div className="logContainer">
            <LogoutIcon className="logouticon"></LogoutIcon>
            <div className="logTxt"> Logout</div>
          </div>
        )}
        {!authStatus && (
          <div className="logContainer">
            <div className="logTxt">Login</div>
            <LoginIcon className="logouticon" color="primary"></LoginIcon>
          </div>
        )}
      </IconButton>
    </div>
  );
}

export default LoginIndicator;
