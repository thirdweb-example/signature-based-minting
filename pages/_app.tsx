import React from "react";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import ThirdwebGuideFooter from "../components/ThirdwebGuideFooter";
import ThirdwebGuideOverlay from "../components/ThirdwebGuideOverlay";
import "./styles/globals.css";
import Head from "next/head";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  const [showGuideOverlay, setShowGuideOverlay] = React.useState(false);

  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <ThirdwebGuideOverlay
        show={showGuideOverlay}
        setShow={setShowGuideOverlay}
      />
      <Head>
        <title>Signature Based Minting with Thirdweb and Next.js</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Learn How To Do Signature Based Minting With Thirdweb And Next.JS To Create A Community Made NFT Collection with Thirdweb's ERC721 NFT Collection Contracts."
        />
        <meta
          name="keywords"
          content="Thirdweb, NFT, Minting, Signature Minting, Signature Based Minting, Thirdweb NFT Collection, Thirdweb NFT Community Made Collection"
        />
      </Head>
      <Component {...pageProps} />
      <ThirdwebGuideFooter onLearnMore={() => setShowGuideOverlay(true)} />
    </ThirdwebProvider>
  );
}

export default MyApp;
