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

// Once activated
const {connector, account, chainId} = useWeb3React();

console.log(Object.is(stargazerConnector, connector));
// true

if (connector instanceof StargazerConnector) {
  // Build your message
  const message = 'Sign this message to confirm your participation in this project.';

  const CHAIN_ID_TO_PROVIDER = {
    1: connector.ethProvider,
    5: connector.ethProvider,
    137: connector.polygonProvider,
    80001: connector.polygonProvider,
    56: connector.bscProvider,
    97: connector.bscProvider,
    43114: connector.avalancheProvider,
    43113: connector.avalancheProvider
  };

  const provider = CHAIN_ID_TO_PROVIDER[chainId!];

  const signature = await provider.request({
    method: 'personal_sign',
    params: [message, account]
  });

  // Send your signature pair for further verification
  const payload = {message, signature};
}
