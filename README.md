# Introduction

In this guide, we will utilize signature-based minting of NFTs to create a "community-built" NFT collection, where each user mints and owns their own NFT based on specific conditions that we provide.

By the end, we'll have an NFT collection of **pages**, where each page has been written and minted by a different user.

Demo Link: https://community-book-nft.vercel.app/

Remember you can always access the code for this project here: https://github.com/thirdweb-example/CommunityBookNFT

## Tools:

- [**thirdweb React SDK**](https://docs.thirdweb.com/react): to enable users to connect and disconnect their wallets with our website, and prompt them to approve transactions with MetaMask.
- [**thirdweb NFT Collection**](https://portal.thirdweb.com/contracts/nft-collection): to create an ERC721 NFT Collection that our community can mint NFTs into.
- [**thirdweb TypeScript SDK**](https://docs.thirdweb.com/typescript): to connect to our NFT Collection Smart contract via TypeScript & React hooks, mint new NFTs, and view all of the NFTs minted so far!
- [**Next JS API Routes**](https://nextjs.org/docs/api-routes/introduction): For us to securely generate signatures on the server-side, on behalf of our wallet, using our wallet's private key.

## Using This Repo

- Click on the **Use This Template** to create your own copy of this repo:
  ![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1651027674000/2lhpBTAYw.png)

- Create your own NFT Collection via the thirdweb dashboard (follow the steps in **Setting Up The NFT Collection** of this doc if you need more help)

- Replace instances of `0x..` with your NFT collection address.

- Create an environment variable in a `.env.local` file with your private key, in the form `PRIVATE_KEY=xxx`, similarly to the `.env.example` file provided.

- Run `npm install` to install the dependencies.

- Run `npm run dev` to start the development server.

- Visit http://localhost:3000/

## What is Signature Based Minting?

NFT Collections come in different shapes, sizes, and rules.

On one end of the spectrum, an NFT collection can be a set amount of NFTs, and they're all made by one wallet, once they're all claimed/minted, no more NFTs are ever minted in the collection. A popular example of this is the [Bored Ape Yacht Club Collection](https://boredapeyachtclub.com/#/).

On the other end of the spectrum, an NFT collection could also start out with no NFTs, and NFTs in this collection could be created by anyone, at any time. These NFTs could be completely different, it just depends on what the user who minted the NFT wanted it to be. This type of collection is a bit less well-known, but demonstrates that NFT collections can be completely different in terms of how the NFTs inside them are generated.

Signature-based minting enables a use case that is somewhere between these two ends of the spectrum. What if you didn't want **EVERYONE** to be able to mint an NFT into your collection, or you only wanted specific types of NFTs to be minted?

Signature-based minting allows you to specify exactly what NFTs you allow to be minted into your NFT collection, by generating a signature for an NFT. This signature can be used by a wallet address that you specify to mint that NFT.

In this guide, we'll grant users signatures to mint NFTs into our collection that follow the format we expect. In the end, we'll have a community-made collection of pages, all of which have a `pageText` field, so that we end up with a book where each page is created by a different user.

Let's get into it!

## Setting Up The NFT Collection

To create an NFT collection, we can use the thirdweb dashboard and create a fully customizable NFT collection in just a few clicks.

Head to https://thirdweb.com/dashboard and create a new contract on the Polygon Mumbai network. Click **Create NFTs and Tokens** > **NFT Collection**.

Give your collection a name and click **Deploy now**!

Nice! Now we have an NFT collection. Let's set up a project and see how we can start minting some NFTs using the thirdweb SDK.

## Setting Up The Project

To get started, we have a ready-made template that includes all the code you need to work with Thirdweb, TypeScript and Next JS available here https://github.com/thirdweb-example/next-typescript-starter

Alternatively, you can create your own repo from scratch, by running:

```bash
npx create-next-app@latest community-book-nft --ts
```

Then install the Thirdweb SDK like so:

```bash
npm install @thirdweb-dev/sdk @thirdweb-dev/react
```

_Note: Need to downgrade from React 18 since it is not currently supported [TODO] follow up with engineering team on this_

Next, we'll wrap our application in the Thirdweb Provider so that we can access Thirdweb anywhere in our application, let's open up `_app.tsx` and change it to look like this:

```ts
import "./styles/globals.css";
import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

// This is the chainId your dApp will work on.
const activeChainId = ChainId.Mumbai;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider desiredChainId={activeChainId}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
```

Awesome, now we can access and use the Thirdweb SDK's hooks and functions anywhere in our application.

Let's head over to the home page at `index.tsx` now so that we can start getting our users connected.

## Connecting User's Wallets

First things first, we want users to be able to connect to our dApp via their MetaMask wallet. Thirdweb has a tonne of helpful hooks such as `useMetaMask` that enable us to get this up and running super fast.

Go ahead and delete the default code inside `index.tsx`, and replace it with this basic code:

```ts
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
  const address = useAddress(); // Grab the current user's address
  const connectWithMetamask = useMetamask(); // Function to connect with metamask
  const disconnectWallet = useDisconnect(); // Function to disconnect from metamask

  return <div></div>;
};

export default Home;
```

The `styles` comes from a file `./styles/Home.module.css`, you can feel free to add your own styles or utilize the styles provided in our example repo.

Nice, now let's add some UI inside the `return` statement, to enable the user to sign in and sign out with some buttons.

```ts
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
  </div>
);
```

The above code shows the user the `Connnect with Metamask` button initially, then swaps to show the `Disconnect Wallet` and also shows the user's current wallet address once they have connected.

Awesome! Now we've got the user connected to our site, let's show them some NFTs!

## Loading & Displaying NFTs

For our community book, each page is an NFT minted by a different user. We can use another thirdweb hook called `useNFTCollection` to connect to our smart contract and load all of the NFT's in our collection.

Once we've loaded them from the smart contract, we can display each NFT to the user, as if they're reading the pages of a book!

Let's implement that in code now.

Firstly, we'll use the `useNFTCollection` to load the NFT collection we deployed via the Thirdweb dashboard:

```ts
// Fetch the NFT collection from thirdweb via it's contract address.
const nftCollection = useNFTCollection(
  // Replace this with your NFT Collection contract address from the dashboard
  "0x0000000000000000000000000000000000000000"
);
```

We'll be using React's `useEffect` hook to fetch the NFTs when the page loads, then the `useState` hook to store the NFTs in state, so that we can render them on the UI.

We'll add two stateful variables to store a loading state while we fetch the NFTs, then another stateful variable to store the actual NFTs once they come back.

```ts
// Loading flag to show while we fetch the NFTs from the smart contract
const [loadingNfts, setLoadingNfts] = useState(true);
// Here we will store the existing NFT's from the collection.
const [nfts, setNfts] = useState<NFTMetadataOwner[]>([]);
// This is where we store the text the user types into the input field (later on).
const [enteredText, setEnteredText] = useState("");
// This is the page index the user is looking at (used later)
const [pageIndex, setPageIndex] = useState(0);
```

Here's the function we run inside a `useEffect`, that calls `getAll` on the NFT collection. Since it can take a second or two to load the actual contract from the `useNFTCollection` hook, we re-run this whenever the value of `nftCollection` changes, so that we make sure we run it when the contract loads.

```ts
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
```

Now we've got the NFT's loaded, let's display them to the user.

Our UI will consist of three key parts:

1. A button to view the previous page NFT
2. The NFT the user is currently viewing
3. A button to view the next page NFT

Here's how that looks, and let's place this beneath the wallet connect `div` we made earlier.

```ts
<h1>Our Community Book:</h1>;

{
  loadingNfts ? (
    // Show a loading state while we fetch the NFTs
    <div>Loading... </div>
  ) : (
    <div className={styles.pageContainer}>
      {/* Left arrow button */}
      <button
        onClick={() => changePage(pageIndex - 1)}
        className={styles.arrowButton}
      >
        {"<"}
      </button>

      {/* Current NFT the user is viewing and it's metadata */}
      <div className={styles.page}>
        {/* The Name of the NFT - (Page Number) */}
        <b>{nfts?.[pageIndex]?.metadata?.name}</b>

        {/* The Description of the NFT (User-entered content) */}
        <p>{nfts?.[pageIndex]?.metadata?.description}</p>

        {/* The owner of the NFT  */}
        <i className={styles.owner}>Owner: {nfts?.[pageIndex]?.owner}</i>
      </div>

      {/* Right arrow button */}
      <button
        className={styles.arrowButton}
        onClick={() => changePage(pageIndex + 1)}
      >
        {">"}
      </button>
    </div>
  );
}
```

Now we can scroll through all the pages that are in our NFT collection, and read all the pages our community has written!

We can also see who is the owner of each nft, and the `name` and `description` of each NFT from the metadata.

But wait, our collection doesn't have any NFTs yet. Let's get to the juicy part. Signature based minting coming up!

## Creating NFTs with Signature Based Minting

In order for our community to create NFTs, we'll add a small piece of UI beneath the pages UI to enable signed in users to create NFTs.

```ts
{
  /* If the user has connected their wallet, show the form to create a new page.  */
}
{
  address && (
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
  );
}
```

This just shows a simple input where user's can type in some text, and a button to call our `mintWithSignature` function that we're about to write.

The way that our signature-based minting process works is in 3 steps:

![image.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1650958559249/S8mlZIQZm.png)

1. The signed-in user calls a [Next JS API Route](https://nextjs.org/docs/api-routes/introduction) with two parameters, `authorAddress` and `pageText` inside the request body.

2. The API route runs some checks on the server-side to see if this user and the NFT they are requesting to mint is eligible or not. If the request _is_ eligible, it generates a signature to mint an NFT with a specific set of characteristics. For example, if the user passed in `"Hello world"` as the `pageText` argument, the signature that gets generated will be for an NFT that's description is "Hello world".

3. Once the API function is done processing, it sends the client/user a signature. The user can call `mint` with this signature to create an NFT with the conditions provided from our server.

The main benefit here is that we have made an environment where us (the owner of the smart contract) can decide what the user can mint into our collection, all programmatically.

We can also create NFTs with metadata that comes from user input, which is why we created the input field earlier.

Okay, let's convert this to code now.

First up, the API route.

### API Route

To do this, you'll need to create a file called `server.ts` in the `/pages/api` directory of your project.

Here's how the code for this API route looks:

```ts
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
        ethers.getDefaultProvider("https://rpc-mumbai.matic.today/")
      )
    );

    // Load the NFT Collection via it's contract address using the SDK
    const nftCollection = sdk.getNFTCollection(
      // Replace this with your NFT Collection contract address
      "0x000000000000000000000000000000000000000"
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
    res.status(500).json({ error: `Server error ${e}` });
  }
}
```

There's a bit to unpack in this API route, let's break it down:

1. We read in the arguments the user passed in from the client-side request so that we can view their account and the text they put in the textbox.

2. We initialize the ThirdwebSDK on the server-side, using our Private key. You'll need to create a `.env.local` file at the root of your project containing your wallet's private key, in the format `PRIVATE_KEY=xxxxx`

3. Once again we're loading our NFT collection via it's contract address

4. We run some checks to view the eligibility of this request, enforcing that each user can only mint one page into the collection, and that there must be at most 100 pages in the collection.

5. Generate the mint signature with `nftCollection.signature.generate` and pass in the information that we received from the client and destructured in step 1.

6. Return the generated signature to the client.

If at any point this process fails or the request is not valid, we send back an error response instead of the generated signature.

### Making the API Request on the client

Now we have an API route available at `/api/server`, we can make `fetch` requests to this API, and securely run that code on the server-side.

Let's head back to `index.tsx` and write the function that calls this API route.

```ts
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
```

Let's break that code down into a few steps:

1. We make a request to the `/api/server` API route using `fetch`. In the body of this request, we provide the user's address in the `authorAddress` field, and also provide the text they entered into the input within the `pageText` field.

2. The code will run on the API route, and come back to us with either a signature or with an error. We can view the response by calling `.json()` on the request response.

3. We call `nftCollection.signature.mint` and pass in the signature that was sent back to us from the server, and mint the NFT!

If you refresh the page, you should see the NFT you minted as the first page of the book. 📖

Nice 😎

# Conclusion

We've created a community-built NFT collection, where each member of our community can mint an NFT and own it!

Signature Based Minting enables awesome possibilities for you to control what NFTs your users can mint into your shared NFT collection.

You could generate signatures based on a set of circumstances, so only specific members of your community can create NFTs. Or you could only provide signatures for NFTs with certain criteria, so that your NFT Collection is built how you want it to be by your community.

Imagine if you made a puzzle that could only be solved with one correct answer, you could provide the winning user a signature to mint an NFT if they submitted the right answer!

The possibilities are endless!
