# Stargazer Wallet Integration Demos

This repository contains integration demos for the [Stargazer Wallet](https://chrome.google.com/webstore/detail/stargazer-wallet/pgiaagfkgcbnmiiolekcfmljdagdhlcm) web extension.

## Installing

The repository contains 3 projects (monorepo) for 2 different types of integrations (standalone, web3-react) and one for sample contracts (ethereum). We're using yarn workspaces, so for installing dependencies you can run the following at the repository root folder.

```bash
yarn install
```

## Running the web3-react integration

```
yarn start-web3react
```

## Running the standalone integration

```
yarn start-standalone
```

## Ethereum Demos, Chain Preference & Sample Contracts

For ethereum demos we've chosen the sepolia testnet for some sample contracts located under [samples/sample-eth-contracts](./samples/sample-eth-contracts). You must use the sepolia network when running the demos, doing otherwise will likely throw some errors.

Sample contracts used are already deployed in the sepolia network at the following addresses.

#### [StargazerGreeter](https://sepolia.etherscan.io/address/0x74299a718b2c44483a27325d7725f0b2646de3b1#code)

```
0x74299a718b2c44483a27325d7725f0b2646de3b1
```

#### [StargazerSampleToken (SST)](https://sepolia.etherscan.io/address/0xfe9885baff18074846aaa2d5541581adf068731d)

```
0xfe9885baff18074846aaa2d5541581adf068731d
```

If you want to get creative the [samples/sample-eth-contracts](./samples/sample-eth-contracts) contains a pretty basic [hardhat](https://hardhat.org/) project you can check out.

## License

This project is licensed under the [MIT License](./LICENSE)
