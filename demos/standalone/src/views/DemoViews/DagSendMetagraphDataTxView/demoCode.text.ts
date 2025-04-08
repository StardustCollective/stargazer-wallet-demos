import {activateStargazerProviders} from 'src/utils';

// Activate Stargazer providers
const {dagProvider} = await activateStargazerProviders();

// Prepare the metagraph address and data
const metagraphAddress = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM';
const data = {
  MintCollection: {
    name: 'One collection'
  }
};

// Response type
type SendDataFeeResponse = {
  /** The transaction hash */
  hash: string;

  /** Optional fee transaction hash */
  feeHash?: string;
};

// Send the metagraph data transaction
const response: SendDataFeeResponse = await dagProvider.request({
  method: 'dag_sendMetagraphDataTransaction',
  params: [metagraphAddress, data]
});

console.log('Transaction hash:', response.hash);
if (response.feeHash) {
  console.log('Fee hash:', response.feeHash);
}
