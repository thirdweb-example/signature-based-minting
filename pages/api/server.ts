import "../styles/globals.css";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers, Wallet } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // De-structure the arguments we passed in out of the request body
    const { authorAddress, pageText } = JSON.parse(req.body);

    // You'll need to add your private key in a .env.local file in the root of your project
    // !!!!! NOTE !!!!! NEVER LEAK YOUR PRIVATE KEY to anyone!
    if (!process.env.PRIVATE_KEY) {
      throw new Error("You're missing PRIVATE_KEY in your .env.local file.");
    }

    // Initialize the Thirdweb SDK on the serverside
    const sdk = new ThirdwebSDK(
      new Wallet(
        // Your wallet private key (read it in from .env.local file)
        process.env.PRIVATE_KEY as string,
        // Your RPC provider
        ethers.getDefaultProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/ioUyv8HQHdNuHpL21sJDWMxB5tQaLCb2"
        )
      )
    );

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = sdk.getNFTCollection(
      "0xA5EE8c548506d4Eb2dd2A24d85d45263180D7F7B"
    );

    // Here we can make all kinds of cool checks to see if the user is eligible to mint the NFT.
    // Here are a few examples:

    // 1) Check that this wallet hasn't already minted a page - 1 NFT per wallet
    const hasMinted = (await nftCollection.balanceOf(authorAddress)).gt(0);
    if (hasMinted) {
      res.status(400).json({ error: "Already minted" });
      return;
    }

    // 2) Check that there are no more than 100 pages - Max Supply of 100 NFTs
    const bookFinished = (await nftCollection.totalSupply()).gt(100);
    if (bookFinished) {
      res.status(400).json({ error: "Book finihsed" });
      return;
    }

    // If all the checks pass, begin generating the signature...

    // This is to generate the page number based on how many pages have been minted already
    const pageNumber = (await nftCollection.totalSupply()).add(1);

    // Generate the signature for the page NFT
    const signedPayload = await nftCollection.signature.generate({
      to: authorAddress,
      metadata: {
        name: `Page ${pageNumber}`,
        description: pageText,
      },
    });

    // Return back the signedPayload to the client.
    res.status(200).json({
      signedPayload: JSON.parse(JSON.stringify(signedPayload)),
    });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
