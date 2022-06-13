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
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import writeCallText from './writeCall.text.ts';
import styles from './index.module.scss';

const Erc20WriteCallView = () => {
  const {account, library, connector} = useWeb3React();

  const [value, setValue] = useState(0);
  const [sender, setSender] = useState('');
  const [spender, setSpender] = useState('');
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
      const StargazerTokenAddress = '0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f';

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
      <Title order={2}>ERC20 - Write Call</Title>
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
          label="ERC20 Contract (Stargazer Token)"
          value="0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f"
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
        <Button onClick={doWriteCall}>Send Write Call</Button>
        {hash && <Textarea label="Transaction hash" readOnly value={hash}></Textarea>}
        {trxStatus && <Textarea label="Transaction status" readOnly value={trxStatus}></Textarea>}
      </Stack>
    </Paper>
  );
};

export {Erc20WriteCallView};
