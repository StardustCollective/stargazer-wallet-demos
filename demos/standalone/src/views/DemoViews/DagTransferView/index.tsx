import {useState} from 'react';
import {Textarea, NumberInput, Select} from '@mantine/core';

import {DemoCard} from 'src/common/components';
import {useStargazerProviders} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const DagTransferView = () => {
  const stargazerProviders = useStargazerProviders();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doTransfer = async () => {
    setLoading(true);
    const {dagProvider} = await stargazerProviders.connect();

    try {
      const txData = {
        source: sender,
        destination: receiver,
        amount: value
      };

      setTrxStatus('Sending...');
      const txHash = await dagProvider.request({
        method: 'dag_sendTransaction',
        params: [txData]
      });
      setHash(txHash);
      setTrxStatus('Sent... Waiting confirmation...');

      let pendingTx;
      while (pendingTx !== null) {
        pendingTx = await dagProvider.request({
          method: 'dag_getPendingTransaction',
          params: [txHash]
        });
      }

      if (pendingTx === null) {
        const confirmedTx = await dagProvider.request({
          method: 'dag_getTransaction',
          params: [txHash]
        });

        if (confirmedTx) {
          // Txn is confirmed - from this point the state cannot be changed
          setTrxStatus(`Confirmed!\nBlock Hash: ${confirmedTx.blockHash}`);
          setLoading(false);
        } else {
          // The txn cannot be found on block explorer. It's a good idea to wait several seconds and try again to confirm the txn has actually been dropped
          setTimeout(async () => {
            const confirmedTx = await dagProvider.request({
              method: 'dag_getTransaction',
              params: [txHash]
            });

            if (confirmedTx) {
              setTrxStatus(`Confirmed!\nBlock Hash: ${confirmedTx.blockHash}`);
            } else {
              setTrxStatus('Transaction not found');
            }
            setLoading(false);
          }, 30000);
        }
        setError('');
      }
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
  };

  return (
    <DemoCard
      walletRequired
      title="$DAG - Transfer"
      codeExample={demoCodeText}
      actionButtonClickContent="Transfer DAG"
      onActionButtonClick={doTransfer}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          {stargazerProviders.connected && (
            <Select
              label="Sender"
              placeholder="DAG..."
              value={sender}
              defaultValue={stargazerProviders.dagAccounts[0]}
              onChange={(value) => setSender(value ?? stargazerProviders.dagAccounts[0])}
              data={stargazerProviders.dagAccounts}
            ></Select>
          )}
          <Textarea
            label="Receiver"
            placeholder="DAG..."
            value={receiver}
            onChange={(event) => setReceiver(event.currentTarget.value)}
          ></Textarea>
          <NumberInput
            label="Value (DATUM)"
            value={value}
            onChange={(value) => setValue(value ?? 0)}
          ></NumberInput>
        </>
      }
      outputs={
        <>
          {hash && <Textarea label="Transaction hash" readOnly value={hash}></Textarea>}
          {trxStatus && <Textarea label="Transaction status" readOnly value={trxStatus}></Textarea>}
        </>
      }
    />
  );
};

export {DagTransferView};
export default DagTransferView;
