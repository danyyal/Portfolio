import React from "react";

import CircularProgress from "@mui/material/CircularProgress";

import "./ButtonLoader.scss";

interface IButtonLoader {
  color:
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning"
    | "inherit";
  size?: string;
}

const ButtonLoader: React.FC<IButtonLoader> = ({ color, size }) => {
  return (
    <div className="button-loader-container">
      <CircularProgress color={color} size={size} />
    </div>
  );
};

export default ButtonLoader;
