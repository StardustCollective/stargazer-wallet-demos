import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

/**
 * Token Lock Parameters Interface
 */
type TokenLockParams = {
  source: string; // Wallet address signing the transaction

  amount: number; // The amount to lock
  // Must be in DATUM

  currencyId?: string; // The currency metagraph identifier that the user wants to lock
  // If not provided, the default currency will be DAG

  fee?: number; // The fee in the currency of the currency metragraph (or DAG)
  // If not provided, the default fee will be 0
  // Must be in DATUM

  unlockEpoch?: number; // The global snapshot epoch progress to unlock the tokens
  // If provided, must be greater than the currentEpoch
};

// Once activated
const {connector} = useWeb3React();

if (connector instanceof StargazerWeb3ReactConnector) {
  // Extract $DAG account 0
  const userAddress = connector.dagAccounts[0];

  // Prepare the token lock parameters
  const tokenLockParams: TokenLockParams = {
    source: userAddress,
    amount: 100000000, // In DATUM
    fee: 0, // In DATUM
    currencyId: 'DAG2jMUs8iRyBnKB6wT6sperwEdXLWURfkbYEevV',
    unlockEpoch: 123456 // Example epoch number
  };

  // Send the token lock request to the wallet
  const transactionHash = await connector.dagProvider.request({
    method: 'dag_tokenLock',
    params: [tokenLockParams]
  });

  console.log('Transaction hash:', transactionHash);
}
