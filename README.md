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

For ethereum demos we've chosen the goerli testnet for some sample contracts located under [samples/sample-eth-contracts](./samples/sample-eth-contracts). You must use the goerli network when running the demos, doing otherwise will likely throw some errors.

Sample contracts used are already deployed in the goerli network at the following addresses.

#### [StargazerGreeter](https://goerli.etherscan.io/address/0x0F1568746563F6F1A01C76B7cfca4390d81D97b2#code)

```
0x0F1568746563F6F1A01C76B7cfca4390d81D97b2
```

#### [StargazerSampleToken (SST)](https://goerli.etherscan.io/address/0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65)

```
0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65
```

If you want to get creative the [samples/sample-eth-contracts](./samples/sample-eth-contracts) contains a pretty basic [hardhat](https://hardhat.org/) project you can check out.

## License

This project is licensed under the [MIT License](./LICENSE)
