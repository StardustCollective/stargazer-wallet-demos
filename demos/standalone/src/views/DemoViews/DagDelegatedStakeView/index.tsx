import {useState} from 'react';
import {Textarea, NumberInput, TextInput, Select} from '@mantine/core';
import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagDelegatedStakeView = () => {
  const stargazerProviders = useStargazerProviders();

  const [source, setSource] = useState('');
  const [nodeId, setNodeId] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [tokenLockRef, setTokenLockRef] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');

  const doDelegatedStake = async () => {
    setLoading(true);
    try {
      const {dagProvider, dagAccounts} = await stargazerProviders.connect();

      // If source is not provided, use the first account
      const sourceAddress = source || dagAccounts[0];

      const delegatedStakeParams = {
        source: sourceAddress,
        nodeId,
        amount,
        fee,
        tokenLockRef
      };

      const transactionHash = await dagProvider.request({
        method: 'dag_delegatedStake',
        params: [delegatedStakeParams]
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
      title="$DAG - Delegated Stake"
      codeExample={demoCodeText}
      actionButtonClickContent="Delegate Stake"
      onActionButtonClick={doDelegatedStake}
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
            label="Node ID"
            placeholder="Node identifier"
            required
            value={nodeId}
            onChange={(event) => setNodeId(event.currentTarget.value)}
          />
          <NumberInput
            label="Amount (in DATUM)"
            placeholder="Amount to stake"
            required
            value={amount}
            onChange={(val) => setAmount(Number(val))}
          />
          <NumberInput
            label="Fee (in DATUM)"
            placeholder="Transaction fee"
            value={fee}
            onChange={(val) => setFee(Number(val))}
          />
          <TextInput
            label="Token Lock Reference"
            placeholder="Reference to the token lock transaction"
            required
            value={tokenLockRef}
            onChange={(event) => setTokenLockRef(event.currentTarget.value)}
          />
        </>
      }
      outputs={<>{hash && <Textarea label="Transaction Hash" value={hash} readOnly />}</>}
    />
  );
};

export {DagDelegatedStakeView};
export default DagDelegatedStakeView;
