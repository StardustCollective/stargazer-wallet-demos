import {useState} from 'react';
import {Select, NumberInput, Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS, STARGAZER_SAMPLE_TOKEN_ADDRESSES} from 'src/utils/constants';

const Erc20TransferView = () => {
  const stargazerProviders = useStargazerProviders();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doTransfer = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider, polygonProvider, bscProvider, avalancheProvider} =
        await stargazerProviders.connect();

      const PROVIDERS = {
        [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
        [STARGAZER_CHAINS.POLYGON]: polygonProvider,
        [STARGAZER_CHAINS.BSC]: bscProvider,
        [STARGAZER_CHAINS.AVALANCHE]: avalancheProvider
      };

      const StargazerTokenAddress: string = STARGAZER_SAMPLE_TOKEN_ADDRESSES[selectedProvider];
      const provider: StargazerEIPProvider = PROVIDERS[selectedProvider];

      const library = new ethers.providers.Web3Provider(provider, 'any');

      const signer = library.getSigner(sender);

      const contract = new ethers.Contract(
        StargazerTokenAddress,
        ERC20ABI,
        signer
      ) as unknown as ERC20;

      const receiverAddress = receiver;
      const receiveValue = ethers.utils.parseUnits(String(value), 18).toHexString();

      setTrxStatus('Sending...');
      const trxResponse = await contract.transfer(receiverAddress, receiveValue);

      setHash(trxResponse.hash);
      setTrxStatus('Sent... Waiting confirmation...');

      const trxReceipt = await library.waitForTransaction(trxResponse.hash);
      setTrxStatus(`Confirmed!\nBlock Number: ${trxReceipt.blockNumber}`);

      setError('');
    } catch (e) {
      setError(String(e));
    }
    setLoading(false);
  };

  return (
    <DemoCard
      walletRequired
      title="ERC20 - Transfer"
      codeExample={demoCodeText}
      actionButtonClickContent="Transfer ERC20"
      onActionButtonClick={doTransfer}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
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
            label="Receiver"
            placeholder="0x..."
            value={receiver}
            onChange={(event) => setReceiver(event.currentTarget.value)}
          ></Textarea>
          <NumberInput
            label="Value (SST)"
            value={value}
            onChange={(value) => setValue(value ?? 0)}
          ></NumberInput>
        </>
      }
      outputs={
        <>
          {hash && <Textarea label="Transaction hash" value={hash}></Textarea>}
          {trxStatus && <Textarea label="Transaction status" readOnly value={trxStatus}></Textarea>}
        </>
      }
    />
  );
};

export {Erc20TransferView};
export default Erc20TransferView;
