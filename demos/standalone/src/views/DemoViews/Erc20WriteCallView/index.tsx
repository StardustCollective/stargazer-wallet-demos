import {useState} from 'react';
import {Textarea, Select, NumberInput} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS} from 'src/utils/constants';

const Erc20WriteCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [spender, setSpender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doWriteCall = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider, polygonProvider, bscProvider} = await stargazerProviders.connect();

      const PROVIDERS = {
        [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
        [STARGAZER_CHAINS.POLYGON]: polygonProvider,
        [STARGAZER_CHAINS.BSC]: bscProvider
      };

      const CONTRACT_ADDRESSES = {
        [STARGAZER_CHAINS.ETHEREUM]: '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',
        [STARGAZER_CHAINS.POLYGON]: '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5',
        [STARGAZER_CHAINS.BSC]: '0x3Ea98D16634aB9fD01e7d749a8711736DBE95440'
      };

      const StargazerTokenAddress = CONTRACT_ADDRESSES[selectedProvider];
      const provider: StargazerEIPProvider = PROVIDERS[selectedProvider];

      const library = new ethers.providers.Web3Provider(provider, 'any');

      const signer = library.getSigner(sender);

      const contract = new ethers.Contract(
        StargazerTokenAddress,
        ERC20ABI,
        signer
      ) as unknown as ERC20;

      const spenderAddress = spender;
      const spendValue = ethers.utils.parseUnits(String(value), 18).toHexString();

      setTrxStatus('Sending...');
      const trxResponse = await contract.approve(spenderAddress, spendValue);

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
      title="ERC20 - Write Call"
      codeExample={demoCodeText}
      actionButtonClickContent="Send Write Call"
      onActionButtonClick={doWriteCall}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Ethereum ERC20 Contract (Stargazer Token)"
            value="0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65"
            readOnly
            disabled
          />
          <Textarea
            label="Polygon ERC20 Contract (Stargazer Token)"
            value="0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5"
            readOnly
            disabled
          />
          <Textarea
            label="BSC ERC20 Contract (Stargazer Token)"
            value="0x3Ea98D16634aB9fD01e7d749a8711736DBE95440"
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
          <Textarea
            label="Spender"
            placeholder="0x..."
            value={spender}
            onChange={(event) => setSpender(event.currentTarget.value)}
          ></Textarea>
          <NumberInput
            label="Value (STT)"
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

export {Erc20WriteCallView};
export default Erc20WriteCallView;
