import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

/**
 * Withdraw Delegated Stake Parameters Interface
 */
type WithdrawDelegatedStakeParams = {
  source: string; // Wallet address signing the transaction

  stakeRef: string; // Reference to the delegated stake transaction
  // Must be a valid delegated stake transaction hash
};

// Once activated
const {connector} = useWeb3React();

if (connector instanceof StargazerWeb3ReactConnector) {
  // Extract $DAG account 0
  const userAddress = connector.dagAccounts[0];

  // Prepare the withdraw delegated stake parameters
  const withdrawDelegatedStakeParams: WithdrawDelegatedStakeParams = {
    source: userAddress,
    stakeRef: 'd4e476b1150ad681d460ec3715d33ca8ba8ccb403b49faee068623bfdcaa822c' // Example stake reference
  };

  // Send the withdraw delegated stake request to the wallet
  const transactionHash = await connector.dagProvider.request({
    method: 'dag_withdrawDelegatedStake',
    params: [withdrawDelegatedStakeParams]
  });

  console.log('Transaction hash:', transactionHash);
}
