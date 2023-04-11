import {useState} from 'react';
import {Select, NumberInput, Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS} from 'src/utils/constants';

const Erc20TransferView = () => {
  const stargazerProviders = useStargazerProviders();

  const [value, setValue] = useState(1);
  const [sender, setSender] = useState('0xe2Db5a1CB999b99c858dD0afe413dD11A8965E39');
  const [receiver, setReceiver] = useState('0xf4CB0d8032601520caD732B9700BBe3514E7c7DB');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doTransfer = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider, polygonProvider} = await stargazerProviders.connect();

      const PROVIDERS = {
        [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
        [STARGAZER_CHAINS.POLYGON]: polygonProvider
      };

      const CONTRACT_ADDRESSES = {
        [STARGAZER_CHAINS.ETHEREUM]: '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',
        [STARGAZER_CHAINS.POLYGON]: '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5'
      };

      const StargazerTokenAddress: string = CONTRACT_ADDRESSES[selectedProvider];
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
