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

For ethereum demos we've chosen the ropsten testnet for some sample contracts located under [samples/sample-eth-contracts](./samples/sample-eth-contracts). You must use the ropsten network when running the demos, doing otherwise will likely throw some errors.

Sample contracts used are already deployed in the ropsten network at the following addresses.

#### [StargazerGreeter](https://ropsten.etherscan.io/address/0x1dbf94d57ceb7b59de0b5efd1e85776aa97cbdb4#code)

```
0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4
```

#### [StargazerSampleToken (SST)](https://ropsten.etherscan.io/address/0x6235bfcc2eb5401932a03e043c9b7de4edce7a2f)

```
0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f
```

If you want to get creative the [samples/sample-eth-contracts](./samples/sample-eth-contracts) contains a pretty basic [hardhat](https://hardhat.org/) project you can check out.

## License

This project is licensed under the [MIT License](./LICENSE)
