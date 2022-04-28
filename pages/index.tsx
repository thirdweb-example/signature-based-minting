import styles from "./styles/Home.module.css";
import {
  MediaRenderer,
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTCollection,
} from "@thirdweb-dev/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import { create } from "ipfs-http-client";

const Home: NextPage = () => {
  // Helpful thirdweb hooks to connect and manage the wallet from metamask.
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  // Fetch the NFT collection from thirdweb via it's contract address.
  const nftCollection = useNFTCollection(
    // Replace this with your NFT Collection contract address
    "0x1B4Ce073A2f288711eC0895b78e0AeFBe36E8Aab"
  );

  // Loading flag to show while we fetch the NFTs from the smart contract
  const [loadingNfts, setLoadingNfts] = useState(true);
  // Here we will store the existing NFT's from the collection.
  const [nfts, setNfts] = useState<NFTMetadataOwner[]>([]);

  // Here we store the user inputs for their NFT.
  const [nftName, setNftName] = useState<string>("");
  const [file, setFile] = useState<File>();

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

  // Magic to get the file upload even though its hidden
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Function to store file in state when user uploads it
  const uploadFile = () => {
    if (fileInputRef?.current) {
      fileInputRef.current.click();

      fileInputRef.current.onchange = () => {
        if (fileInputRef?.current?.files?.length) {
          const file = fileInputRef.current.files[0];
          setFile(file);
        }
      };
    }
  };

  // This function calls a Next JS API route that mints an NFT with signature-based minting.
  // We send in the address of the current user, and the text they entered as part of the request.
  const mintWithSignature = async () => {
    try {
      console.log({ file, nftName });
      if (!file || !nftName) {
        alert("Please enter a name and upload a file.");
        return;
      }

      // Create an instance of the client
      // TODO: Replace this with thirdweb's new IPFS work
      // @ts-ignore
      const client = create("https://ipfs.infura.io:5001/api/v0");

      const added = await client.add(file);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;

      console.log("Added file", url);

      // Make a request to /api/server
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address, // Address of the current user
          nftName: nftName,
          imagePath: url,
        }),
      });

      console.log("Received Signed payload", signedPayloadReq);

      // Grab the JSON from the response
      const json = await signedPayloadReq.json();

      console.log("Json:", json);

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

  return (
    <>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.left}>
          <div>
            <a
              href="https://thirdweb.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={`/logo.png`} alt="Thirdweb Logo" width={135} />
            </a>
          </div>
        </div>
        <div className={styles.right}>
          {address ? (
            <>
              <a
                className={styles.secondaryButton}
                onClick={() => disconnectWallet()}
              >
                Disconnect Wallet
              </a>
              <p style={{ marginLeft: 8, marginRight: 8, color: "grey" }}>|</p>
              <p>
                {address.slice(0, 6).concat("...").concat(address.slice(-4))}
              </p>
            </>
          ) : (
            <a
              className={styles.mainButton}
              onClick={() => connectWithMetamask()}
            >
              Connect Wallet
            </a>
          )}
        </div>
      </div>

      {/* Content */}
      <div className={styles.container}>
        {/* Top Section */}
        <h1 style={{ marginBottom: 0 }}>Signature-Based Minting</h1>
        <p style={{ fontSize: "1.125rem" }}>
          Signature-based minting with{" "}
          <b>
            {" "}
            <a
              href="https://thirdweb.com/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#9f2c9d" }}
            >
              thirdweb
            </a>
          </b>{" "}
          + Next.JS to create a community-made NFT collection with restrictions.
        </p>

        <p>
          Hint: We only give out signatures if your NFT name is a cool{" "}
          <b>animal name</b>! 😉
        </p>

        <hr style={{ width: "50%", borderColor: "grey", opacity: 0.25 }} />

        <div className={styles.collectionContainer}>
          <h2 className={styles.ourCollection}>
            Mint your own NFT into the collection:
          </h2>

          <input
            type="text"
            placeholder="Name of your NFT"
            style={{
              width: "75%",
              backgroundColor: "transparent",
              border: "1px solid grey",
              borderRadius: 8,
              color: "#fff",
              height: 48,
              padding: "0 16px",
              fontSize: "1rem",
              marginBottom: 16,
            }}
            maxLength={26}
            onChange={(e) => setNftName(e.target.value)}
          />

          {file ? (
            <img
              src={URL.createObjectURL(file)}
              style={{ cursor: "pointer", maxHeight: 250, borderRadius: 8 }}
              onClick={() => setFile(undefined)}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: 100,
                border: "1px dashed grey",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "grey",
                cursor: "pointer",
              }}
              onClick={uploadFile}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                console.log("asdmniadnauisdbuiyadsb iuy");
                e.preventDefault();
                setFile(e.dataTransfer.files[0]);
              }}
            >
              Drag and drop an image here to upload it!
            </div>
          )}
        </div>
        <input
          type="file"
          accept="image/png, image/gif, image/jpeg"
          id="profile-picture-input"
          ref={fileInputRef}
          style={{ display: "none" }}
        />

        <div style={{ marginTop: 24 }}>
          {address ? (
            <a className={styles.mainButton} onClick={mintWithSignature}>
              Mint NFT
            </a>
          ) : (
            <a className={styles.mainButton} onClick={connectWithMetamask}>
              Connect Wallet
            </a>
          )}
        </div>

        <hr
          style={{
            width: "25%",
            borderColor: "grey",
            marginTop: 64,
            opacity: 0.25,
          }}
        />

        <div className={styles.collectionContainer}>
          <h2 className={styles.ourCollection}>
            Other NFTs in this collection:
          </h2>

          {loadingNfts ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.nftGrid}>
              {nfts?.map((nft) => (
                <div
                  className={styles.nftItem}
                  key={nft.metadata.id.toString()}
                >
                  <div>
                    <MediaRenderer
                      src={nft.metadata.image}
                      style={{
                        height: 90,
                        borderRadius: 16,
                      }}
                    />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p>Named</p>
                    <p>
                      <b>{nft.metadata.name}</b>
                    </p>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <p>Owned by</p>
                    <p>
                      <b>
                        {nft.owner
                          .slice(0, 6)
                          .concat("...")
                          .concat(nft.owner.slice(-4))}
                      </b>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
