import {useWeb3React} from '@web3-react/core';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

const stargazerConnector = new StargazerConnector({
  supportedChainIds: [
    1,      // Ethereum Mainnet
    5,      // Ethereum Goerli Testnet
    137,    // Polygon Mainnet
    80001,  // Polygon Testnet
    56,     // BSC Mainnet
    97,     // BSC Testnet
    43114,  // Avalanche C-Chain
    43113   // Avalanche Fuji Testnet
  ]
});

const {activate, connector} = useWeb3React();

await activate(stargazerConnector);

// Switch EVM provider

const newProvider = 'polygon'; // 'ethereum' | 'polygon' | 'bsc' | 'avalanche'

if (connector instanceof StargazerConnector) {
  await connector.switchEVMProvider(newProvider);
}

