import {useState} from 'react';
import {Select, NumberInput, Textarea} from '@mantine/core';
import * as ethers from 'ethers';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';

const Erc20TransferView = () => {
  const {connector, library} = useWeb3React();

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
      const StargazerTokenAddress = '0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f';

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
      console.error(e);
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
            label="Value"
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
