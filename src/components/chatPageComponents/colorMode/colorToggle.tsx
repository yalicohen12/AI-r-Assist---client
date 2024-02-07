import React, { useState, useEffect } from "react";
import "./colorToggle.css";
import { DarkModeSwitch } from "react-toggle-dark-mode";

const ColorToggle = () => {
  const [checked, setChecked] = useState(true);
  function handleColorToggle() {}

  return (
    <label className="switch">
      <input
        type="checkbox"
        defaultChecked={checked}
        onChange={() => handleColorToggle()}
      />
      <span className="slider round" />
    </label>
  );
};

export default ColorToggle;
