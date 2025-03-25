import {useState} from 'react';
import {TextInput, Textarea} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from 'src/utils';
import {DemoCard} from 'src/common/components';
import demoCodeText from './demoCode.text.ts';

const DagWithdrawDelegatedStakeView = () => {
  const {connector} = useWeb3React();

  const [source, setSource] = useState('');
  const [stakeRef, setStakeRef] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');

  const doWithdrawDelegatedStake = async () => {
    setLoading(true);
    setHash('');
    setError('');
    try {
      if (connector instanceof StargazerWeb3ReactConnector) {
        // If source is not provided, use the first account
        const sourceAddress = source || connector.dagAccounts[0];

        const withdrawDelegatedStakeParams = {
          source: sourceAddress,
          stakeRef
        };

        const transactionHash = await connector.dagProvider.request({
          method: 'dag_withdrawDelegatedStake',
          params: [withdrawDelegatedStakeParams]
        });

        setHash(transactionHash);
        setError('');
      }
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <DemoCard
      walletRequired
      title="$DAG - Withdraw Delegated Stake"
      codeExample={demoCodeText}
      actionButtonClickContent="Withdraw Delegated Stake"
      onActionButtonClick={doWithdrawDelegatedStake}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <TextInput
            label="Source"
            placeholder="DAG..."
            value={source}
            onChange={(event) => setSource(event.currentTarget.value)}
          />
          <TextInput
            label="Stake Reference"
            placeholder="Reference to the delegated stake transaction"
            required
            value={stakeRef}
            onChange={(event) => setStakeRef(event.currentTarget.value)}
          />
        </>
      }
      outputs={<>{hash && <Textarea label="Transaction Hash" value={hash} readOnly />}</>}
    />
  );
};

export {DagWithdrawDelegatedStakeView};
export default DagWithdrawDelegatedStakeView;
