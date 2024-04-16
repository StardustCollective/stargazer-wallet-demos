import {activateStargazerProviders} from 'src/utils';
import {dag4} from '@stardust-collective/dag4';

type JSONScalarValue = null | string | number | boolean;

type StargazerDagSignatureRequest = {
  content: string;
  metadata: Record<string, JSONScalarValue>;
};

const {dagProvider} = await activateStargazerProviders();

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

// Get $DAG accounts
const dagAccounts = await dagProvider.request({method: 'dag_accounts', params: []});

// Extract $DAG account 0
const userAddress = dagAccounts[0];

const signature = await dagProvider.request({
  method: 'dag_signMessage',
  params: [userAddress, signatureRequestEnconded]
});

const publicKey = await dagProvider.request({method: 'dag_getPublicKey', params: [userAddress]});

// Send your signature trio for further verification
const payload = {signatureRequestEnconded, signature, publicKey};

// Verify signature using dag4.js
// Build the message with prefix
const message = `\u0019Constellation Signed Message:\n${signatureRequestEnconded.length}\n${signatureRequestEnconded}`;

const result = await dag4.keyStore.verify(publicKey, message, signature);
// true -> verification succeeded
// false -> verification failed
