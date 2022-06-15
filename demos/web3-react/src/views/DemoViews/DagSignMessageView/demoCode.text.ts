import {useWeb3React} from '@web3-react/core';
import {StargazerConnector} from 'stargazer-connector';

type JSONScalarValue = null | string | number | boolean;

type StargazerDagSignatureRequest = {
  content: string;
  metadata: Record<string, JSONScalarValue>;
};

const stargazerConnector = new StargazerConnector({
  supportedChainIds: [1, 3]
});

// Once activated
const {connector} = useWeb3React();

console.log(Object.is(stargazerConnector, connector));
// true

if (connector instanceof StargazerConnector) {
  // Build the signature request
  const signatureRequest: StargazerDagSignatureRequest = {
    content: 'Sign this message to confirm your participation in this project.',
    metadata: {
      field1: 'an-useful-value',
      field2: 1,
      field3: null /* ,
      field4: {
        // Nested fields are not supported
        prop:1
      } */
    }
  };

  // Encode the signature request - Base64 < JSON < Request
  const signatureRequestEnconded = window.btoa(JSON.stringify(signatureRequest));

  // Extract $DAG account 0
  const userAddress = connector.dagAccounts[0];

  const signature = await connector.dagProvider.request({
    method: 'dag_signMessage',
    params: [userAddress, signatureRequestEnconded]
  });

  const publicKey = await connector.dagProvider.request({
    method: 'dag_getPublicKey',
    params: [userAddress]
  });

  // Send your signature trio for further verification
  const payload = {signatureRequestEnconded, signature, publicKey};
}
