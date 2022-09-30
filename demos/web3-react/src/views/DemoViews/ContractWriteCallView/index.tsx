import {useState} from 'react';
import {Textarea, Select} from '@mantine/core';
import * as ethers from 'ethers';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';

const greetings = [
  {value: '0', label: '(0) Good Morning!'},
  {value: '1', label: '(1) Bon Matin!'},
  {value: '2', label: '(2) Buenos Días!'},
  {value: '3', label: '(3) Guten Morgen!'},
  {value: '4', label: '(4) Buongiorno!'},
  {value: '5', label: '(5) Bom Dia!'},
  {value: '6', label: '(6) Bonan Matenon!'},
  {value: '7', label: '(7) Yom Tov!'},
  {value: '8', label: '(8) Suprabhat!'},
  {value: '9', label: '(9) Selamat Siang!'}
];

const ContractWriteCallView = () => {
  const {library, connector} = useWeb3React();

  const [greetingId, setGreetingId] = useState('0');
  const [sender, setSender] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doWriteCall = async () => {
    setLoading(true);
    if (library === undefined) {
      setError('Unable to get library provider (ethers.js)');
      return;
    }

    try {
      const StargazerGreeterAddress = '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2';

      const signer = library.getSigner(sender);

      const contract = new ethers.Contract(
        StargazerGreeterAddress,
        StargazerGreeterABI,
        signer
      ) as unknown as StargazerGreeter;

      setTrxStatus('Sending...');
      const trxResponse = await contract.setGreeting(greetingId);

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
      title="Smart Contract - Write Call"
      codeExample={demoCodeText}
      actionButtonClickContent="Send Write Call"
      onActionButtonClick={doWriteCall}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Smart Contract (Stargazer Greeter)"
            value="0x0F1568746563F6F1A01C76B7cfca4390d81D97b2"
            readOnly
            disabled
          ></Textarea>
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
          <Select
            label="Greeting (Id)"
            value={greetingId}
            defaultValue={greetings[0].value}
            onChange={(value) => setGreetingId(value ?? greetings[0].value)}
            data={greetings}
          ></Select>
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

export {ContractWriteCallView};
export default ContractWriteCallView;
