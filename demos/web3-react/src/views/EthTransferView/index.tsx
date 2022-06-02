import {useState} from 'react';
import {
  Title,
  Stack,
  Button,
  Alert,
  Loader,
  Center,
  Paper,
  Textarea,
  NumberInput,
  LoadingOverlay,
  Text,
  Select
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';
import * as ethers from 'ethers';
import {StargazerConnector} from 'stargazer-connector';

import {useWeb3React} from 'src/utils';
import {BaseColor} from 'src/common/consts';

import transferText from './transfer.text.ts';
import styles from './index.module.scss';

const EthTransferView = () => {
  const {account, library, connector} = useWeb3React();

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
      const oneGwei = ethers.BigNumber.from(1 * 1e9).toHexString();

      const signer = library.getSigner(sender);

      setTrxStatus('Sending...');
      const trxResponse = await signer.sendTransaction({to: receiver, value: oneGwei});

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
      <Title order={2}>ETH - Transfer</Title>
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
            placeholder="DAG2ukVE..."
            value={sender}
            defaultValue={connector.ethAccounts[0]}
            onChange={(value) => setSender(value ?? connector.ethAccounts[0])}
            data={connector.ethAccounts}
          ></Select>
        )}
        <Textarea
          label="Receiver"
          placeholder="DAG2ukVE..."
          value={receiver}
          onChange={(event) => setReceiver(event.currentTarget.value)}
        ></Textarea>
        <NumberInput
          label="Value (GWEI)"
          value={value}
          onChange={(value) => setValue(value ?? 0)}
        ></NumberInput>
        <Button onClick={doTransfer}>Transfer ETH</Button>
        {hash && <Textarea label="Transaction hash" readOnly value={hash}></Textarea>}
        {trxStatus && <Textarea label="Transaction status" readOnly value={trxStatus}></Textarea>}
      </Stack>
    </Paper>
  );
};

export {EthTransferView};
