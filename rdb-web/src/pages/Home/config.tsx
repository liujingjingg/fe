import React from "react";

export const levelOptions = ["p1", "p2", "p3"];

export const levelMaps = {
  1: (
    <div
      style={{
        textAlign:'center',
        lineHeight:'24px',
        width: "36px",
        height:"24PX",
        background: "#FB4E57 ",
        borderRadius: "2px",
        fontSize: "12px",
        color: "#FFFFFF",
      }}
    >
      P1
    </div>
  ),
  2: (
    <div
      style={{
        display: "inline-block",
        padding: "0px 8px",
        background: "#F97370",
        borderRadius: "2px",
        fontSize: "12px",
        color: "#FFFFFF",
      }}
    >
      P2
    </div>
  ),
  3: (
    <div
      style={{
        display: "inline-block",
        padding: "0px 8px",
        background: "#FFAB0A",
        borderRadius: "2px",
        fontSize: "12px",
        color: "#FFFFFF",
      }}
    >
      P3
    </div>
  ),
};
