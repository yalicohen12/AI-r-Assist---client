// LoadingSpinner.tsx

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from "@mui/material";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        // marginLeft: "14rem",
        display: "flex",
        flexDirection: "row",
        gap:"0.4rem",
        alignItems:"center",
        justifyContent:"center"
        // gap: "0.3rem",
      }}
    >
      <CircularProgress style={{ fontSize: "0.2rem", color: "white" }} />
      <div style={{ font: "Arial" }}> Proccesing</div>
    </div>
  );
};

export default LoadingSpinner;
