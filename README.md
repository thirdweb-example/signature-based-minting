# Signature Based Minting Example

This project demonstrates how you can create a "community-built" NFT collection, where each user mints and owns their own NFT based on specific conditions that we provide.

## Installation

Install the template with [thirdweb create](https://portal.thirdweb.com/cli/create)

```bash
npx thirdweb create --template signature-based-minting
```

## Set up

- Create your own [NFT Collection](thirdweb.com/thirdweb.eth/tokenerc721) via the [thirdweb dashboard](https://thirdweb.com).

- Add your contract address to the [`const/yourDetails.ts`](/const/yourDetails.ts) file, in the form `export const NFT_COLLECTION_ADDRESS = "xxx";`.

### Environment Variables

To run this project, you will need to add the following environment variables to your .env file:

```bash
NEXT_PUBLIC_TEMPLATE_CLIENT_ID=
TW_SECRET_KEY=
WALLET_PRIVATE_KEY=
```

- Generate your `TW_SECRET_KEY` and `NEXT_PUBLIC_TEMPLATE_CLIENT_ID` via thirdweb's [dashboard](https://thirdweb.com/create-api-key).
- For `WALLET_PRIVATE_KEY` export your wallet private key from your wallet.

### Run Locally

Install dependencies:

```bash
yarn
```

Start the server:

```bash
yarn start
```

## Additional Resources

- [Documentation](https://portal.thirdweb.com)
- [Templates](https://thirdweb.com/templates)
- [Video Tutorials](https://youtube.com/thirdweb_)
- [Blog](https://blog.thirdweb.com)

## Contributing

Contributions and [feedback](https://feedback.thirdweb.com) are always welcome!

Please visit our [open source page](https://thirdweb.com/open-source) for more information.

## Need help?

For help, join the [discord](https://discord.gg/thirdweb) or visit our [support page](https://support.thirdweb.com).
