import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers, Wallet } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function server(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    console.log("Processing req");
    // Eiman was the greatest salesman. But one day...
    const { authorAddress, pageText } = JSON.parse(req.body);

    console.log("Received Request", authorAddress, pageText);
    const sdk = new ThirdwebSDK(
      new Wallet(
        process.env.PKEY as string,
        ethers.getDefaultProvider(
          "https://polygon-mumbai.g.alchemy.com/v2/ioUyv8HQHdNuHpL21sJDWMxB5tQaLCb2"
        )
      )
    );
    const nftCollection = sdk.getNFTCollection(
      "0x1FC91eDF62e170ca30532a08E36f4c77BFB3d84F"
    );

    console.log("SDK ready");

    // Do the verifications
    // - check that author hasn't minted yet
    const hasMinted = (await nftCollection.balanceOf(authorAddress)).gt(0);
    console.log("hasMinted?", hasMinted);
    if (hasMinted) {
      res.status(400).json({ error: "Already minted" });
      return;
    }
    // - check that no more than 100 pages
    const bookFinished = (await nftCollection.totalSupply()).gt(100);
    console.log("bookFinished?", bookFinished);
    if (bookFinished) {
      res.status(400).json({ error: "Book finihsed" });
      return;
    }
    // if all good, generate a signed NFT payload
    const pageNumber = (await nftCollection.totalSupply()).add(1);
    const signedPayload = await nftCollection.signature.generate({
      to: authorAddress,
      metadata: {
        name: `Page ${pageNumber}`,
        description: pageText,
      },
    });

    console.log("Minting", signedPayload.payload);

    const tx = await nftCollection.signature.mint(signedPayload);
    // TODO send it back to the client
    res.status(200).json(signedPayload);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Server error" });
  }
}
