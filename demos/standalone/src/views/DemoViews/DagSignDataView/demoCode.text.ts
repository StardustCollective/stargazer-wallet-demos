import {activateStargazerProviders} from 'src/utils';
import {dag4} from '@stardust-collective/dag4';

const {dagProvider} = await activateStargazerProviders();

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

// Encode the data - Base64 < JSON < data
const dataEncoded = window.btoa(JSON.stringify(data));

// Encode the string directly if "data" is a string:
// const data = "This is a custom string.";
//
//                      Base64 < String
// const dataEncoded = window.btoa(data);

// Get $DAG accounts
const dagAccounts = await dagProvider.request({method: 'dag_accounts', params: []});

// Extract $DAG account 0
const userAddress = dagAccounts[0];

const signature = await dagProvider.request({
  method: 'dag_signData',
  params: [userAddress, dataEncoded]
});

const publicKey = await dagProvider.request({
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
