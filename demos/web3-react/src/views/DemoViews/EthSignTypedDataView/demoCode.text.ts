import {useWeb3React} from '@web3-react/core';
import * as ethers from 'ethers';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

const stargazerConnector = new StargazerWeb3ReactConnector({
  supportedChainIds: [
    1, // Ethereum Mainnet
    11155111, // Ethereum Sepolia Testnet
    137, // Polygon Mainnet
    80001, // Polygon Testnet
    56, // BSC Mainnet
    97, // BSC Testnet
    43114, // Avalanche C-Chain
    43113 // Avalanche Fuji Testnet
  ]
});

// Once activated
const {connector, account, chainId} = useWeb3React();

console.log(Object.is(stargazerConnector, connector));
// true

if (connector instanceof StargazerWeb3ReactConnector) {
  // Build your EIP-712 domain
  const domain = {
    name: 'Stargazer Demo',
    version: '1.0.0',
    chainId,
    verifyingContract: '0xabcdefABCDEF1234567890abcdefABCDEF123456'
  };

  // Build your EIP-712 types
  const types = {
    DeviceControl: [
      {name: 'principal', type: 'AuthorizedEntity'},
      {name: 'emergency', type: 'AuthorizedEntity'}
    ],
    AuthorizedEntity: [
      {name: 'address', type: 'address'},
      {name: 'validUntil', type: 'uint256'}
    ]
  };

  // Build your EIP-712 value / message
  const value = {
    principal: {
      address: '0xEb14c9bb6C2DEc2eCb9B278C9fa1EC763B04d545',
      validUntil: 1657823568
    },
    emergency: {
      address: '0xcAc3DA343670aBB46BC6E8e6d375B66217519093',
      validUntil: 1752517998
    }
  };

  // We are using ethers to build a EIP-712 payload from our domain, types and value.
  const messagePayload = ethers.utils._TypedDataEncoder.getPayload(domain, types, value);

  const signature = await connector.ethProvider.request({
    method: 'eth_signTypedData',
    params: [account, messagePayload]
  });

  // Send your signature pair for further verification
  const payload = {messagePayload, signature};
}
