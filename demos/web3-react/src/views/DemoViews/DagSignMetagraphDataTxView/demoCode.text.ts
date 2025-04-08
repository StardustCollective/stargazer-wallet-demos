import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

// Once activated
const {connector} = useWeb3React();

// Response type
type SignDataFeeResponse = {
  /** The transaction hash */
  hash: string;

  /** Optional fee transaction hash */
  feeHash?: string;

  /** The transaction signature */
  signature: string;

  /** Optional fee transaction signature */
  feeSignature?: string;
};

if (connector instanceof StargazerWeb3ReactConnector) {
  // Prepare the metagraph address and data
  const metagraphAddress = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM';
  const data = {
    MintCollection: {
      name: 'One collection'
    }
  };

  // Sign the metagraph data transaction
  const response: SignDataFeeResponse = await connector.dagProvider.request({
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
}
