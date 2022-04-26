import styles from "./styles/Home.module.css";
import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTCollection,
} from "@thirdweb-dev/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  // Fetch the NFT collection from thirdweb via it's contract address.
  const nftCollection = useNFTCollection(
    "0xA5EE8c548506d4Eb2dd2A24d85d45263180D7F7B"
  );

  const [loadingNfts, setLoadingNfts] = useState(true);
  // Here we will store the existing NFT's from the collection.
  const [nfts, setNfts] = useState<NFTMetadataOwner[]>([]);
  // This is where we store the text the user types into the input field.
  const [enteredText, setEnteredText] = useState("");
  // This is the page index the user is looking at
  const [pageIndex, setPageIndex] = useState(0);

  // This useEffect block runs whenever the value of nftCollection changes.
  // When the collection is loaded from the above useNFTCollection hook, we'll call getAll()
  // to get all the NFT's from the collection and store them in state.
  useEffect(() => {
    if (nftCollection) {
      (async () => {
        const loadedNfts = await nftCollection.getAll();
        setNfts(loadedNfts);
        setLoadingNfts(false);
      })();
    }
  }, [nftCollection]);

  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    try {
      // Make a request to /api/server
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address, // Address of the current user
          pageText: enteredText, // Text the user entered into the input field
        }),
      });

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();

      // If the request failed, we'll show an error.
      if (!signedPayloadReq.ok) {
        alert(json.error);
        return;
      }

      // If the request succeeded, we'll get the signed payload from the response.
      // The API should come back with a JSON object containing a field called signedPayload.
      // This line of code will parse the response and store it in a variable called signedPayload.
      const signedPayload = json.signedPayload;

      // Now we can call signature.mint and pass in the signed payload that we received from the server.
      // This means we provided a signature for the user to mint an NFT with.
      const nft = await nftCollection?.signature.mint(signedPayload);

      console.log("Successfully minted NFT with signature", nft);

      return nft;
    } catch (e) {
      console.error("An error occurred trying to mint the NFT:", e);
    }
  };

  const changePage = (index: number) => {
    if (index < 0 || index >= nfts.length) {
      return;
    }

    setPageIndex(index);
  };

  return (
    <div>
      <div className={styles.connect}>
        {/* Show the user the connect or disconnect button depending on if they are connected or not */}
        {address ? (
          <>
            <button className={styles.btn} onClick={disconnectWallet}>
              Disconnect Wallet
            </button>
            <p className={styles.address}>Your address: {address}</p>
          </>
        ) : (
          <button className={styles.btn} onClick={connectWithMetamask}>
            Connect with Metamask
          </button>
        )}
      </div>

      <h1>Our Community Book:</h1>

      {loadingNfts ? (
        <div>Loading... </div>
      ) : (
        <div className={styles.pageContainer}>
          <button
            onClick={() => changePage(pageIndex - 1)}
            className={styles.arrowButton}
          >
            {"<"}
          </button>
          <div className={styles.page}>
            {/* The Name of the NFT - (Page Number) */}
            <b>{nfts?.[pageIndex]?.metadata?.name}</b>

            {/* The Description of the NFT (User-entered content) */}
            <p>{nfts?.[pageIndex]?.metadata?.description}</p>

            {/* The owner of the NFT  */}
            <i className={styles.owner}>Owner: {nfts?.[pageIndex]?.owner}</i>
          </div>

          <button
            className={styles.arrowButton}
            onClick={() => changePage(pageIndex + 1)}
          >
            {">"}
          </button>
        </div>
      )}

      {/* If the user has connected their wallet, show the form to create a new page.  */}
      {address && (
        <div className={styles.btnContainer}>
          <input
            className={styles.input}
            type="text"
            placeholder="Your Page Contents..."
            onChange={(e) => setEnteredText(e.target.value)}
          />
          <button className={styles.btn} onClick={mintWithSignature}>
            Create A Page
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
