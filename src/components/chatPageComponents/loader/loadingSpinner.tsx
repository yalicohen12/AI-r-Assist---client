// LoadingSpinner.tsx

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import LoadingIcons from "react-loading-icons";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        // marginLeft: "14rem",
        display: "flex",
        flexDirection: "row",
        gap: "0.4rem",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgb(28, 30, 58, 1)",
        padding: "0.4rem",
        borderRadius: "1rem" ,
        marginLeft: " 1rem",
        // gap: "0.3rem",
      }}
    >
      {/* <CircularProgress style={{ fontSize: "0.2rem", color: "white" }} /> */}
      <LoadingIcons.ThreeDots
        style={{ fontSize: "0.1rem", color: "blue" }}
      ></LoadingIcons.ThreeDots>
      {/* <div style={{ font: "Arial" }}> Proccesing</div> */}
    </div>
  );
};

export default LoadingSpinner;
