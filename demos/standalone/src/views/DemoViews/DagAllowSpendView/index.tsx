import {useState} from 'react';
import {Textarea, NumberInput, TextInput, Select} from '@mantine/core';
import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagAllowSpendView = () => {
  const stargazerProviders = useStargazerProviders();

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [approvers, setApprovers] = useState('');
  const [amount, setAmount] = useState(0);
  const [fee, setFee] = useState(0);
  const [validUntilEpoch, setValidUntilEpoch] = useState(0);
  const [currencyId, setCurrencyId] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [hash, setHash] = useState('');

  const doAllowSpend = async () => {
    setLoading(true);
    try {
      const {dagProvider, dagAccounts} = await stargazerProviders.connect();

      // If source is not provided, use the first account
      const sourceAddress = source || dagAccounts[0];
      // Split approvers by comma if provided as string
      const approversList = approvers ? approvers.split(',').map((a) => a.trim()) : [destination]; // Default to destination if not provided

      const allowSpendParams = {
        source: sourceAddress,
        destination,
        approvers: approversList,
        amount,
        fee,
        ...(currencyId ? {currencyId} : {}),
        ...(validUntilEpoch ? {validUntilEpoch} : {})
      };

      const transactionHash = await dagProvider.request({
        method: 'dag_allowSpend',
        params: [allowSpendParams]
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
      title="$DAG - Allow Spend"
      codeExample={demoCodeText}
      actionButtonClickContent="Allow Spend"
      onActionButtonClick={doAllowSpend}
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
            label="Destination"
            placeholder="DAG address that will receive the funds"
            required
            value={destination}
            onChange={(event) => setDestination(event.currentTarget.value)}
          />
          <TextInput
            label="Approvers (comma-separated)"
            placeholder="DAG addresses that can approve the transaction"
            required
            value={approvers}
            onChange={(event) => setApprovers(event.currentTarget.value)}
          />
          <NumberInput
            label="Amount (in DATUM)"
            placeholder="Amount to transfer"
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
          <NumberInput
            label="Valid Until Epoch"
            placeholder="Enter the global snapshot epoch progress for which this is valid until"
            value={validUntilEpoch}
            onChange={(val) => setValidUntilEpoch(Number(val))}
          />
          <TextInput
            label="Currency ID"
            placeholder="Metagraph currency identifier (empty for DAG)"
            value={currencyId}
            onChange={(event) => setCurrencyId(event.currentTarget.value)}
          />
        </>
      }
      outputs={<>{hash && <Textarea label="Transaction Hash" value={hash} readOnly />}</>}
    />
  );
};

export {DagAllowSpendView};
export default DagAllowSpendView;
