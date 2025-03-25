import {useState} from 'react';
import {NumberInput, Select, TextInput, Textarea} from '@mantine/core';
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {BaseColor} from 'src/common/consts/colors';
import demoCodeText from './demoCode.text.ts';

const DagAllowSpendView = () => {
  const {connector} = useWeb3React();

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
    setHash('');
    setError('');
    try {
      if (connector instanceof StargazerWeb3ReactConnector) {
        const userAddress = connector.dagAccounts[0];
        const sourceAddress = source || userAddress;

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

        const transactionHash = await connector.dagProvider.request({
          method: 'dag_allowSpend',
          params: [allowSpendParams]
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
      title="$DAG - Allow Spend"
      codeExample={demoCodeText}
      actionButtonClickContent="Allow Spend"
      onActionButtonClick={doAllowSpend}
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
