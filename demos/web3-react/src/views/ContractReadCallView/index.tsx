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
  Textarea
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';
import * as ethers from 'ethers';

import {useWeb3React} from 'src/utils';
import {BaseColor} from 'src/common/consts';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import writeCallText from './readCall.text.ts';
import styles from './index.module.scss';

const ContractReadCallView = () => {
  const {account, library} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [greeting, setGreeting] = useState('');

  const doReadCall = async () => {
    setLoading(true);
    if (library === undefined) {
      setError('Unable to get library provider (ethers.js)');
      return;
    }

    try {
      const StargazerGreeterAddress = '0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4';

      const contract = new ethers.Contract(
        StargazerGreeterAddress,
        StargazerGreeterABI,
        library
      ) as unknown as StargazerGreeter;

      const greeting = await contract.greet();

      setGreeting(greeting);
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
        <Button onClick={doReadCall}>Send Read Call</Button>
        {greeting && <Textarea label="Greeting" readOnly value={greeting}></Textarea>}
      </Stack>
    </Paper>
  );
};

export {ContractReadCallView};
