import {useState} from 'react';
import {NumberInput, Select, TextInput, Textarea} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagTokenLockView = () => {
  const {connector} = useWeb3React();

  const [source, setSource] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [currencyId, setCurrencyId] = useState('');
  const [unlockEpoch, setUnlockEpoch] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');

  const doTokenLock = async () => {
    setLoading(true);
    setHash('');
    setError('');
    try {
      if (connector instanceof StargazerWeb3ReactConnector) {
        // If source is not provided, use the first account
        const sourceAddress = source || connector.dagAccounts[0];

        const tokenLockParams = {
          source: sourceAddress,
          amount,
          fee,
          ...(currencyId ? {currencyId} : {}),
          ...(unlockEpoch > 0 && {unlockEpoch})
        };

        const transactionHash = await connector.dagProvider.request({
          method: 'dag_tokenLock',
          params: [tokenLockParams]
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
      title="$DAG - Token Lock"
      codeExample={demoCodeText}
      actionButtonClickContent="Lock Tokens"
      onActionButtonClick={doTokenLock}
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
          <NumberInput
            label="Amount (in DATUM)"
            placeholder="Amount to lock"
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
            label="Currency ID"
            placeholder="Metagraph currency identifier (empty for DAG)"
            value={currencyId}
            onChange={(event) => setCurrencyId(event.currentTarget.value)}
          />
          <NumberInput
            label="Unlock Epoch"
            placeholder="Epoch to unlock tokens (optional)"
            value={unlockEpoch}
            onChange={(val) => setUnlockEpoch(Number(val))}
          />
        </>
      }
      outputs={<>{hash && <Textarea label="Transaction Hash" value={hash} readOnly />}</>}
    />
  );
};

export {DagTokenLockView};
export default DagTokenLockView;
