import {useState} from 'react';
import {Textarea, TextInput, Select} from '@mantine/core';
import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagWithdrawDelegatedStakeView = () => {
  const stargazerProviders = useStargazerProviders();

  const [source, setSource] = useState('');
  const [stakeRef, setStakeRef] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');

  const doWithdrawDelegatedStake = async () => {
    setLoading(true);
    try {
      const {dagProvider, dagAccounts} = await stargazerProviders.connect();

      // If source is not provided, use the first account
      const sourceAddress = source || dagAccounts[0];

      const withdrawDelegatedStakeParams = {
        source: sourceAddress,
        stakeRef
      };

      const transactionHash = await dagProvider.request({
        method: 'dag_withdrawDelegatedStake',
        params: [withdrawDelegatedStakeParams]
      });

      setHash(transactionHash);
      setError('');
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <DemoCard
      walletRequired
      title="DAG - Withdraw Delegated Stake"
      codeExample={demoCodeText}
      actionButtonClickContent="Withdraw DelegatedStake"
      onActionButtonClick={doWithdrawDelegatedStake}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          {stargazerProviders.connected && (
            <Select
              label="Source"
              placeholder="DAG..."
              value={source}
              defaultValue={stargazerProviders.dagAccounts[0]}
              onChange={(value) => setSource(value ?? stargazerProviders.dagAccounts[0])}
              data={stargazerProviders.dagAccounts}
              styles={() => ({
                selected: {
                  color: BaseColor.SOFT_IRIS
                }
              })}
            />
          )}
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
