import styles from "../pages/styles/Thirdweb.module.css";
import React from "react";

type Props = {
  onLearnMore: () => void;
};

export default function ThirdwebGuideFooter({ onLearnMore }: Props) {
  return (
    <div className={styles.footerContainer}>
      {/* Left Side column */}
      <div className={styles.left}>
        <div>
          <h4>Built with 💜 using</h4>
        </div>
        <div>
          <a href="https://thirdweb.com/">
            <img src={`/logo.png`} alt="Thirdweb Logo" width={135} />
          </a>
        </div>
      </div>

      {/* Right Side column */}
      <div className={styles.right} style={{ gap: 6 }}>
        <a className={styles.secondaryButton} onClick={onLearnMore}>
          Learn More
        </a>

        <a
          href="https://github.com/REPO_HERE"
          className={styles.secondaryButton}
          style={{ textDecoration: "none" }}
        >
          View on GitHub
        </a>

        <a className={styles.mainButton}>Deploy Your Own</a>
      </div>
    </div>
  );
}
