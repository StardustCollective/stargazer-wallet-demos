import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {dag4} from '@stardust-collective/dag4';

const stargazerConnector = new StargazerWeb3ReactConnector({
  supportedChainIds: [
    1, // Ethereum Mainnet
    5, // Ethereum Goerli Testnet
    137, // Polygon Mainnet
    80001, // Polygon Testnet
    56, // BSC Mainnet
    97, // BSC Testnet
    43114, // Avalanche C-Chain
    43113 // Avalanche Fuji Testnet
  ]
});

// Once activated
const {connector} = useWeb3React();

console.log(Object.is(stargazerConnector, connector));
// true

if (connector instanceof StargazerWeb3ReactConnector) {
  // Build the signature request
  const data: any = {
    field1: 'content_field_1',
    field2: {
      field2_1: true,
      field2_2: 12332435,
      field2_3: {
        field2_3_1: 'content_field2_3_1'
        // Nested fields are supported
      }
    },
    field3: [1, 2, 3, 4],
    field4: null
  };

  // Encode the signature request - Base64 < JSON < Request
  const dataEncoded = window.btoa(JSON.stringify(data));

  // Encode the string directly if "data" is a string:
  // const data = "This is a custom string.";
  //
  //                      Base64 < String
  // const dataEncoded = window.btoa(data);

  // Extract $DAG account 0
  const userAddress = connector.dagAccounts[0];

  const signature = await connector.dagProvider.request({
    method: 'dag_signData',
    params: [userAddress, dataEncoded]
  });

  const publicKey = await connector.dagProvider.request({
    method: 'dag_getPublicKey',
    params: [userAddress]
  });

  // Send your signature trio for further verification
  const payload = {dataEncoded, signature, publicKey};

  // Verify signature using dag4.js
  // Build the message with prefix
  const message = `\u0019Constellation Signed Data:\n${dataEncoded.length}\n${dataEncoded}`;

  const result = await dag4.keyStore.verifyData(publicKey, message, signature);
  // true -> verification succeeded
  // false -> verification failed
}
