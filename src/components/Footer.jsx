// src/components/Footer.jsx
import React, { useState, useEffect } from "react";

const Footer = ({ isCountingDown }) => {
  const [opacity, setOpacity] = useState(isCountingDown ? 0.15 : 0.4);

  // Add a smooth transition effect when switching between counting/not counting
  useEffect(() => {
    if (isCountingDown) {
      setOpacity(0.15);
    } else {
      setOpacity(0.4);
    }
  }, [isCountingDown]);

  return (
    <div
      className={`footer ${isCountingDown ? "counting" : "visible"}`}
      style={{
        opacity,
        transition: "opacity 0.5s ease",
      }}
    >
      <div className="footer-copyright">MakerClub@GEARSBUU</div>
      <div className="footer-name">Copyright © 2025 Yotin Nakheawngam</div>
    </div>
  );
};

export default Footer;
