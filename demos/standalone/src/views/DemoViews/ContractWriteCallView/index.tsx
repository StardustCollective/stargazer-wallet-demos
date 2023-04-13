import {useState} from 'react';
import {Textarea, Select} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS} from 'src/utils/constants';

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
  const stargazerProviders = useStargazerProviders();

  const [greetingId, setGreetingId] = useState('0');
  const [sender, setSender] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doWriteCall = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);
    const {ethProvider, polygonProvider, bscProvider} = await stargazerProviders.connect();

    const PROVIDERS = {
      [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
      [STARGAZER_CHAINS.POLYGON]: polygonProvider,
      [STARGAZER_CHAINS.BSC]: bscProvider
    };

    const CONTRACT_ADDRESSES = {
      [STARGAZER_CHAINS.ETHEREUM]: '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2',
      [STARGAZER_CHAINS.POLYGON]: '0xce4E723904f5a679eACB9D70710210024F62378C',
      [STARGAZER_CHAINS.BSC]: '0x53c50ceaDc5A97F440608730d7B7D492F628c1cD'
    };

    try {
      const StargazerGreeterAddress: string = CONTRACT_ADDRESSES[selectedProvider];
      const provider: StargazerEIPProvider = PROVIDERS[selectedProvider];

      const library = new ethers.providers.Web3Provider(provider, 'any');

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
            label="Ethereum Smart Contract (Stargazer Greeter)"
            value="0x0F1568746563F6F1A01C76B7cfca4390d81D97b2"
            readOnly
            disabled
          />
          <Textarea
            label="Polygon Smart Contract (Stargazer Greeter)"
            value="0xce4E723904f5a679eACB9D70710210024F62378C"
            readOnly
            disabled
          />
          <Textarea
            label="BSC Smart Contract (Stargazer Greeter)"
            value="0x53c50ceaDc5A97F440608730d7B7D492F628c1cD"
            readOnly
            disabled
          />
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
