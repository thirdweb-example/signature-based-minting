import React from "react";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
};

export default function ThirdwebGuideOverlay({ show, setShow }: Props) {
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
          backgroundColor: "#262936",
          borderRadius: 12,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "#fff",
          boxShadow:
            "1px 1px 3px 1px rgb(20 0 50 / 19%), 0 0 15px 0 rgb(238 50 255 / 57%), 0 5px 53px 0 rgb(75 29 255 / 73%)",
        }}
      >
        <div
          style={{
            position: "fixed",
            top: 24,
            left: 24,
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <a
            href={"https://thirdweb.com/"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={`/logo.png`} alt="Thirdweb Logo" width={135} />
          </a>
        </div>

        {/* Fixed position close modal button */}
        <div
          onClick={() => setShow(false)}
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
            cursor: "pointer",
            border: "1px solid #fff",
            borderRadius: "50%",
            height: 30,
            width: 30,
            textAlign: "center",
          }}
        >
          <span>&times;</span>
        </div>

        <h1
          style={{
            marginTop: 64,
            marginBottom: 0,
          }}
        >
          Signature Based Minting
        </h1>
        <p>
          Signature-based minting is an effective way of building a restricted
          community-made NFT collection.
        </p>

        <h3 style={{ marginBottom: 0 }}>More Resources:</h3>

        <ul>
          <li>
            <a
              href="https://docs.thirdweb.com/typescript/category/signature-minting"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#3e76d5",
              }}
            >
              <b>TypeScript SDK Signature Minting Docs</b>
            </a>
          </li>
        </ul>

        <p>
          Have more questions?{" "}
          <a
            href="https://discord.gg/thirdweb"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#9f2c9d",
              textDecoration: "none",
            }}
          >
            <b>Join our Discord!</b>
          </a>
        </p>
      </div>
    </div>
  );
}
