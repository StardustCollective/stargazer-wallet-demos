import {activateStargazerProviders} from 'src/utils';

/**
 * Withdraw Delegated Stake Parameters Interface
 */
type WithdrawDelegatedStakeParams = {
  /** Wallet address signing the transaction */
  source: string;

  /** Reference to the delegated stake transaction. Must be a valid delegated stake transaction hash */
  stakeRef: string;
};

// Activate Stargazer providers
const {dagProvider} = await activateStargazerProviders();

// Get user's DAG address
const dagAccounts = await dagProvider.request({method: 'dag_accounts', params: []});
const userAddress = dagAccounts[0];

// Prepare the withdraw delegated stake parameters
const withdrawDelegatedStakeParams: WithdrawDelegatedStakeParams = {
  source: userAddress,
  stakeRef: 'd4e476b1150ad681d460ec3715d33ca8ba8ccb403b49faee068623bfdcaa822c' // Example stake reference
};

// Send the withdraw delegated stake request to the wallet
const transactionHash = await dagProvider.request({
  method: 'dag_withdrawDelegatedStake',
  params: [withdrawDelegatedStakeParams]
});

console.log('Transaction hash:', transactionHash);
