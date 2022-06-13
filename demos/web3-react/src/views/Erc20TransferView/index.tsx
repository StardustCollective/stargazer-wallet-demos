import {useState} from 'react';
import {
  Title,
  Stack,
  Button,
  Alert,
  Loader,
  Center,
  Paper,
  LoadingOverlay,
  Text,
  Select,
  NumberInput,
  Textarea
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';
import * as ethers from 'ethers';
import {StargazerConnector} from 'stargazer-connector';

import {useWeb3React} from 'src/utils';
import {BaseColor} from 'src/common/consts';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import transferText from './transfer.text.ts';
import styles from './index.module.scss';

const Erc20TransferView = () => {
  const {account, connector, library} = useWeb3React();

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
      setTrxStatus('Sent...');

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
    <Paper shadow="xs" className={styles.main}>
      <Title order={2}>ERC20 - Transfer</Title>
      <Stack sx={{position: 'relative'}}>
        <LoadingOverlay
          color={BaseColor.WHITE}
          visible={!account}
          loader={<Text>Connect your wallet to use this demo</Text>}
        />
        <Prism language="tsx">{transferText}</Prism>
        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Ohh no!" color="red">
            {error}
          </Alert>
        )}
        {loading && (
          <Center>
            <Loader />
          </Center>
        )}
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
        <Button onClick={doTransfer}>Transfer ERC20</Button>
        {hash && (
          <>
            <Textarea label="Transaction hash" value={hash}></Textarea>
          </>
        )}
        {trxStatus && <Textarea label="Transaction status" readOnly value={trxStatus}></Textarea>}
      </Stack>
    </Paper>
  );
};

export {Erc20TransferView};
