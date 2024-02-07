// LoadingSpinner.tsx

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { IconButton } from "@mui/material";

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        marginLeft: "14rem",
        display: "flex",
        flexDirection: "row",
        gap: "0.3rem",
      }}
    >
      <IconButton>
        <img
          src={process.env.PUBLIC_URL + "/img/llama.png"}
          className="userIcon"
          alt="Bamza 108"
        />
      </IconButton>
      <CircularProgress style={{ fontSize: "0.5rem", color: "white" }} />
    </div>
  );
};

export default LoadingSpinner;
