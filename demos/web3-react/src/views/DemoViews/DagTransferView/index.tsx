import {useState} from 'react';
import {Textarea, NumberInput, Select} from '@mantine/core';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';

import demoCodeText from './demoCode.text.ts';
import {BaseColor} from 'src/common/consts/colors';

const DagTransferView = () => {
  const {connector} = useWeb3React();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doTransfer = async () => {
    setLoading(true);
    setError('');
    setHash('');
    setTrxStatus('');

    try {
      if (connector instanceof StargazerConnector) {
        const txData = {
          source: sender,
          destination: receiver,
          amount: value
        };

        setTrxStatus('Sending...');
        const txHash = await connector.dagProvider.request({
          method: 'dag_sendTransaction',
          params: [txData]
        });
        setHash(txHash);
        setTrxStatus('Sent... Waiting confirmation...');

        let pendingTx;
        while (pendingTx !== null) {
          pendingTx = await connector.dagProvider.request({
            method: 'dag_getPendingTransaction',
            params: [txHash]
          });
        }

        if (pendingTx === null) {
          const confirmedTx = await connector.dagProvider.request({
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
              const confirmedTx = await connector.dagProvider.request({
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
      isLoading={loading}
      error={error}
      inputs={
        <>
          {connector instanceof StargazerConnector && (
            <Select
              label="Sender"
              placeholder="DAG..."
              value={sender}
              defaultValue={connector.dagAccounts[0]}
              onChange={(value) => setSender(value ?? connector.dagAccounts[0])}
              data={connector.dagAccounts}
              styles={() => ({
                selected: {
                  color: BaseColor.SOFT_IRIS
                }
              })}
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
