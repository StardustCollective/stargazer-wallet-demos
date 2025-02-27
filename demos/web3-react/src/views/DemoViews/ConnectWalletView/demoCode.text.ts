import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

const stargazerConnector = new StargazerWeb3ReactConnector({
  supportedChainIds: [
    1, // Ethereum Mainnet
    11155111, // Ethereum Sepolia Testnet
    137, // Polygon Mainnet
    80002, // Polygon Amoy Testnet
    56, // BSC Mainnet
    97, // BSC Testnet
    43114, // Avalanche C-Chain
    43113, // Avalanche Fuji Testnet
    8453, // Base Mainnet
    84532 // Base Sepolia Testnet
  ]
});

const {activate} = useWeb3React();

await activate(stargazerConnector);
