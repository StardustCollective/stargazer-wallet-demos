import {useState} from 'react';
import {Textarea, Select, NumberInput} from '@mantine/core';
import * as ethers from 'ethers';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {
  CHAIN_ID_TO_PROVIDER,
  STARGAZER_SAMPLE_TOKEN_ADDRESSES,
  STARGAZER_TOKEN_STRING
} from 'src/common/consts/constants';
import {BaseColor} from 'src/common/consts/colors';

const Erc20WriteCallView = () => {
  const {library, connector, chainId} = useWeb3React();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [spender, setSpender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [trxStatus, setTrxStatus] = useState('');
  const [hash, setHash] = useState('');

  const doWriteCall = async () => {
    setLoading(true);
    setError('');
    setTrxStatus('');
    setHash('');

    if (library === undefined) {
      setError('Unable to get library provider (ethers.js)');
      return;
    }

    try {
      const provider = CHAIN_ID_TO_PROVIDER[chainId!];
      const StargazerTokenAddress = STARGAZER_SAMPLE_TOKEN_ADDRESSES[provider];

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
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Smart Contract Address (Stargazer Token)"
            value={STARGAZER_TOKEN_STRING}
            readOnly
            minRows={5}
            disabled
          />
          {connector instanceof StargazerConnector && (
            <Select
              label="Sender"
              placeholder="0x..."
              value={sender}
              defaultValue={connector.ethAccounts[0]}
              onChange={(value) => setSender(value ?? connector.ethAccounts[0])}
              data={connector.ethAccounts}
              styles={() => ({
                selected: {
                  color: BaseColor.SOFT_IRIS
                }
              })}
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
