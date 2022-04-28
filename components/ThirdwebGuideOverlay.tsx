import React, { useEffect } from "react";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function ThirdwebGuideOverlay({ show, setShow }: Props) {
  useEffect(() => {
    // If anyone clicks
  });

  return (
    <div
      style={{
        // Overlay
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 100,
        display: show ? "flex" : "none",
      }}
    >
      <div
        style={{
          // Guide
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "500px",
          maxWidth: "90%",
          backgroundColor: "white",
          borderRadius: 12,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#262936",
          boxShadow:
            "1px 1px 3px 1px rgb(20 0 50 / 19%), 0 0 15px 0 rgb(238 50 255 / 57%), 0 5px 53px 0 rgb(75 29 255 / 73%)",
        }}
      >
        {/* Fixed position close modal button */}
        <div
          onClick={() => setShow(false)}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            border: "1px solid #262936",
            borderRadius: "50%",
            height: 30,
            width: 30,
            textAlign: "center",
          }}
        >
          <span>&times;</span>
        </div>

        <h1>Signature Based Minting</h1>
        <p>
          This is a Modal where you can find more resources, we can link a more
          in-depth blog post or a youtube video here.
        </p>
        <p>
          Have more questions?{" "}
          <a
            href="

          "
          >
            <b>Join our Discord!</b>
          </a>
        </p>
      </div>
    </div>
  );
}
