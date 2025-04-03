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
type SignDataFeeResponse = {
  hash: string; // The transaction hash
  feeHash?: string; // Optional fee transaction hash
  signature: string; // The transaction signature
  feeSignature?: string; // Optional fee transaction signature
};

// Sign the metagraph data transaction
const response: SignDataFeeResponse = await dagProvider.request({
  method: 'dag_signMetagraphDataTransaction',
  params: [metagraphAddress, data]
});

console.log('Transaction hash:', response.hash);
if (response.feeHash) {
  console.log('Fee hash:', response.feeHash);
}
console.log('Signature:', response.signature);
if (response.feeSignature) {
  console.log('Fee signature:', response.feeSignature);
}
