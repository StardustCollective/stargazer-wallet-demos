import {useWeb3React} from '@web3-react/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';

/**
 * Delegated Stake Parameters Interface
 */
type DelegatedStakeParams = {
  source: string; // Wallet address signing the transaction

  nodeId: string; // The node identifier to delegate stake to
  // Must be a valid node ID

  amount: number; // The amount to stake
  // Must be in DATUM

  fee?: number; // The fee in DATUM
  // If not provided, the default fee will be 0
  // Must be in DATUM

  tokenLockRef: string; // Reference to the token lock transaction
  // Must be a valid token lock transaction hash
};

// Once activated
const {connector} = useWeb3React();

if (connector instanceof StargazerWeb3ReactConnector) {
  // Extract $DAG account 0
  const userAddress = connector.dagAccounts[0];

  // Prepare the delegated stake parameters
  const delegatedStakeParams: DelegatedStakeParams = {
    source: userAddress,
    nodeId: '53773175b15b4564e58b7cd6c3332abdec1b4cb93c2d2e9138d05995ea6550e5',
    amount: 10000000, // In DATUM
    fee: 10000000, // In DATUM
    tokenLockRef: 'd4e476b1150ad681d460ec3715d33ca8ba8ccb403b49faee068623bfdcaa822c'
  };

  // Send the delegated stake request to the wallet
  const transactionHash = await connector.dagProvider.request({
    method: 'dag_delegatedStake',
    params: [delegatedStakeParams]
  });

  console.log('Transaction hash:', transactionHash);
}
