import {useState} from 'react';
import {Textarea, NumberInput, TextInput, Select} from '@mantine/core';
import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagTokenLockView = () => {
  const stargazerProviders = useStargazerProviders();

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
    try {
      const {dagProvider, dagAccounts} = await stargazerProviders.connect();

      // If source is not provided, use the first account
      const sourceAddress = source || dagAccounts[0];

      const tokenLockParams = {
        source: sourceAddress,
        amount,
        fee,
        ...(currencyId ? {currencyId} : {}),
        ...(unlockEpoch > 0 && {unlockEpoch})
      };

      const transactionHash = await dagProvider.request({
        method: 'dag_tokenLock',
        params: [tokenLockParams]
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
      title="$DAG - Token Lock"
      codeExample={demoCodeText}
      actionButtonClickContent="Lock Tokens"
      onActionButtonClick={doTokenLock}
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
