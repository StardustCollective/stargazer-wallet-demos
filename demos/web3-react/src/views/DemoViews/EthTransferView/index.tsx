import {useState} from 'react';
import {Textarea, NumberInput, Select} from '@mantine/core';
import * as ethers from 'ethers';
import {StargazerConnector} from 'stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';

import demoCodeText from './demoCode.text.ts';

const EthTransferView = () => {
  const {library, connector} = useWeb3React();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doTransfer = async () => {
    setLoading(true);
    if (library === undefined) {
      setError('Unable to get library provider (ethers.js)');
      return;
    }

    try {
      const valueInWei = ethers.BigNumber.from(value * 1e9).toHexString();

      const signer = library.getSigner(sender);

      setTrxStatus('Sending...');
      const trxResponse = await signer.sendTransaction({to: receiver, value: valueInWei});

      setHash(trxResponse.hash);
      setTrxStatus('Sent... Waiting confirmation...');

      const trxReceipt = await library.waitForTransaction(trxResponse.hash);
      setTrxStatus(`Confirmed!\nBlock Number: ${trxReceipt.blockNumber}`);

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
      title="ETH - Transfer"
      codeExample={demoCodeText}
      actionButtonClickContent="Transfer ETH"
      onActionButtonClick={doTransfer}
      isLoading={loading}
      error={error}
      inputs={
        <>
          {connector instanceof StargazerConnector && (
            <Select
              label="Sender"
              placeholder="0x..."
              value={sender}
              defaultValue={connector.ethAccounts[0]}
              onChange={(value) => setSender(value ?? connector.ethAccounts[0])}
              data={connector.ethAccounts}
            ></Select>
          )}
          <Textarea
            label="Receiver"
            placeholder="0x..."
            value={receiver}
            onChange={(event) => setReceiver(event.currentTarget.value)}
          ></Textarea>
          <NumberInput
            label="Value (GWEI)"
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

export {EthTransferView};
export default EthTransferView;
