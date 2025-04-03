import {useState} from 'react';
import {NumberInput, Select, TextInput, Textarea} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagDelegatedStakeView = () => {
  const {connector} = useWeb3React();

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
    setHash('');
    setError('');
    try {
      if (connector instanceof StargazerWeb3ReactConnector) {
        // If source is not provided, use the first account
        const sourceAddress = source || connector.dagAccounts[0];

        const delegatedStakeParams = {
          source: sourceAddress,
          nodeId,
          amount,
          fee,
          tokenLockRef
        };

        const transactionHash = await connector.dagProvider.request({
          method: 'dag_delegatedStake',
          params: [delegatedStakeParams]
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
      title="DAG - Delegated Stake"
      codeExample={demoCodeText}
      actionButtonClickContent="Delegate Stake"
      onActionButtonClick={doDelegatedStake}
      isLoading={loading}
      error={error}
      inputs={
        <>
          {connector instanceof StargazerWeb3ReactConnector && (
            <Select
              label="Sender"
              placeholder="DAG..."
              value={source}
              defaultValue={connector.dagAccounts[0]}
              onChange={(value) => setSource(value ?? connector.dagAccounts[0])}
              data={connector.dagAccounts}
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
