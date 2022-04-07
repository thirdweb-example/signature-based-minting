import {
  useAddress,
  useDisconnect,
  useMetamask,
  useNFTCollection,
} from "@thirdweb-dev/react";
import { NFTMetadataOwner } from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();
  const nftCollection = useNFTCollection(
    "0x1FC91eDF62e170ca30532a08E36f4c77BFB3d84F"
  );

  const [nfts, setNfts] = useState<NFTMetadataOwner[]>([]);
  const [enteredText, setEnteredText] = useState("");

  useEffect(() => {
    if (nftCollection) {
      // call functions on your contract
      nftCollection
        .getAll()
        .then((nfts) => {
          setNfts(nfts);
        })
        .catch((error) => {
          console.error("failed to fetch nfts", error);
        });
    }
  }, [nftCollection]);

  const mintWithSignature = async () => {
    try {
      const signedPayloadReq = await fetch(`/api/server`, {
        method: "POST",
        body: JSON.stringify({
          authorAddress: address,
          pageText: enteredText,
        }),
      });
    } catch (e) {
      console.log(e);
    }

    // TODO get the response from signedPayloadReq
    // nftCollection.signature.mint(response)
  };

  const pages = (
    <ul>
      {nfts.map((nft) => (
        <li key={nft.metadata.id.toString()}>
          <div>
            <b>{nft.metadata.name}</b>
            <br />
            {nft.metadata.description}
          </div>
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      {address ? (
        <>
          <button onClick={disconnectWallet}>Disconnect Wallet</button>
          <p>Your address: {address}</p>
        </>
      ) : (
        <button onClick={connectWithMetamask}>Connect with Metamask</button>
      )}
      <div>
        <input
          value={enteredText}
          onChange={(e) => setEnteredText(e.target.value)}
        />
        <button onClick={mintWithSignature}>Mint a page</button>
      </div>
      {pages}
    </div>
  );
};

export default Home;
