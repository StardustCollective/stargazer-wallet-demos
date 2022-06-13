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
  Textarea,
  Select,
  NumberInput
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';
import * as ethers from 'ethers';
import {StargazerConnector} from 'stargazer-connector';

import {useWeb3React} from 'src/utils';
import {BaseColor} from 'src/common/consts';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import writeCallText from './writeCall.text.ts';
import styles from './index.module.scss';

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
  const {account, library, connector} = useWeb3React();

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
      const StargazerGreeterAddress = '0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4';

      const signer = library.getSigner(sender);

      const contract = new ethers.Contract(
        StargazerGreeterAddress,
        StargazerGreeterABI,
        signer
      ) as unknown as StargazerGreeter;

      setTrxStatus('Sending...');
      const trxResponse = await contract.setGreeting(greetingId);

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
      <Title order={2}>Smart Contract - Write Call</Title>
      <Stack sx={{position: 'relative'}}>
        <LoadingOverlay
          color={BaseColor.WHITE}
          visible={!account}
          loader={<Text>Connect your wallet to use this demo</Text>}
        />
        <Prism language="tsx">{writeCallText}</Prism>
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
        <Textarea
          label="Smart Contract (Stargazer Greeter)"
          value="0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4"
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
        <Button onClick={doWriteCall}>Send Write Call</Button>
        {hash && <Textarea label="Transaction hash" readOnly value={hash}></Textarea>}
        {trxStatus && <Textarea label="Transaction status" readOnly value={trxStatus}></Textarea>}
      </Stack>
    </Paper>
  );
};

export {ContractWriteCallView};
