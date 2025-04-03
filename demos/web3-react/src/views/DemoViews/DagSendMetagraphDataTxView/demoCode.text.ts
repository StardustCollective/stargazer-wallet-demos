import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

// Once activated
const {connector} = useWeb3React();

if (connector instanceof StargazerWeb3ReactConnector) {
  // Prepare the metagraph address and data
  const metagraphAddress = 'DAG0CyySf35ftDQDQBnd1bdQ9aPyUdacMghpnCuM';
  const data = {
    MintCollection: {
      name: 'One collection'
    }
  };

  // Send the metagraph data transaction
  const response = await connector.dagProvider.request({
    method: 'dag_sendMetagraphDataTransaction',
    params: [metagraphAddress, data]
  });

  console.log('Transaction hash:', response.hash);
  if (response.feeHash) {
    console.log('Fee hash:', response.feeHash);
  }
}
