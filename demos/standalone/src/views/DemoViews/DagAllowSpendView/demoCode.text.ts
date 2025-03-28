import {activateStargazerProviders} from 'src/utils';

/**
 * Allow Spend Parameters Interface
 */

type AllowSpendParams = {
  source: string; // Wallet address signing the transaction

  destination: string; // The destination address
  // Can be a metagraph or wallet address

  amount: number; // The amount to allow spend
  // Must be in DATUM

  approvers: string[]; // A list of DAG addresses which can atomically approve this operation
  // Can be metagraph or wallet addresses

  currencyId?: string; // The currency metagraph identifier
  // If not provided, the default currency will be DAG

  fee?: number; // The fee in the currency of the currency metragraph (or DAG)
  // If not provided, the default fee will be 0
  // Must be in DATUM

  validUntilEpoch?: number; // The global snapshot epoch progress for which this is valid until
  // If not provided, the default value will be currentEpoch + 30
  // Minumum allowed value: currentEpoch + 5
  // Maximum allowed value: currentEpoch + 60
};

// Activate Stargazer providers
const {dagProvider} = await activateStargazerProviders();

// Get user's DAG address
const dagAccounts = await dagProvider.request({method: 'dag_accounts', params: []});
const userAddress = dagAccounts[0];

// Prepare the allow spend parameters
const allowSpendParams: AllowSpendParams = {
  source: userAddress,
  destination: 'DAG7WxrQKqGnB8JEHWKWBHGraFcTk4kB8Si5ags9',
  approvers: ['DAG7WxrQKqGnB8JEHWKWBHGraFcTk4kB8Si5ags9'],
  amount: 100000000, // In DATUM
  fee: 0, // In DATUM
  currencyId: 'DAG2jMUs8iRyBnKB6wT6sperwEdXLWURfkbYEevV',
  validUntilEpoch: 123456 // Example epoch number
};

// Send the allow spend request to the wallet
const transactionHash = await dagProvider.request({
  method: 'dag_allowSpend',
  params: [allowSpendParams]
});

console.log('Transaction hash:', transactionHash);
