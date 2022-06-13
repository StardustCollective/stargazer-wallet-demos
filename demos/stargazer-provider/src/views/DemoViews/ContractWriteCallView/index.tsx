import {useState} from 'react';
import {Textarea, Select} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';

const greetings = [
  {value: '0', label: '(0) Good Morning!'},
  {value: '1', label: '(1) Bon Matin!'},
  {value: '2', label: '(2) Buenos D\xC3\xADas!'},
  {value: '3', label: '(3) Guten Morgen!'},
  {value: '4', label: '(4) Buongiorno!'},
  {value: '5', label: '(5) Bom Dia!'},
  {value: '6', label: '(6) Bonan Matenon!'},
  {value: '7', label: '(7) Yom Tov!'},
  {value: '8', label: '(8) Suprabhat!'},
  {value: '9', label: '(9) Selamat Siang!'}
];

const ContractWriteCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [greetingId, setGreetingId] = useState('0');
  const [sender, setSender] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doWriteCall = async () => {
    setLoading(true);
    const {ethProvider} = await stargazerProviders.connect();

    try {
      const StargazerGreeterAddress = '0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4';

      const library = new ethers.providers.Web3Provider(ethProvider, 'any');

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
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Smart Contract (Stargazer Greeter)"
            value="0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4"
            readOnly
            disabled
          ></Textarea>
          {stargazerProviders.connected && (
            <Select
              label="Sender"
              placeholder="0x..."
              value={sender}
              defaultValue={stargazerProviders.ethAccounts[0]}
              onChange={(value) => setSender(value ?? stargazerProviders.ethAccounts[0])}
              data={stargazerProviders.ethAccounts}
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
