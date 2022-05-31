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
import {StargazerConnector} from 'stargazer-connector';

import {useWeb3React} from '@/src/utils';

import signMessageText from './signMessage.text.ts';
import styles from './index.module.scss';
import {BaseColor} from '@/src/common/consts';

const EthSignMessageView = () => {
  const {account, connector} = useWeb3React();

  const [value, setValue] = useState(
    "Sign this message to confirm your participation in this month's program."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');

  const doSignMessage = async () => {
    setLoading(true);
    try {
      if (connector instanceof StargazerConnector) {
        // Build your message
        const message = "Sign this message to confirm your participation in this month's program.";

        const signature = await connector.ethProvider.request({
          method: 'personal_sign',
          params: [account, message]
        });

        setSignature(signature);
        setError('');
      }
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Paper shadow="xs" className={styles.main}>
      <Title order={2}>ETH - Sign Message</Title>
      <Stack sx={{position: 'relative'}}>
        <LoadingOverlay
          color={BaseColor.WHITE}
          visible={!account}
          loader={<Text>Connect your wallet to use this demo</Text>}
        />
        <Prism language="tsx">{signMessageText}</Prism>
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
          label="Your message"
          placeholder="A cool message to sign"
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
        ></Textarea>
        <Button onClick={doSignMessage}>Sign Message</Button>
        {signature && (
          <>
            <Textarea label="Signature" value={signature}></Textarea>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export {EthSignMessageView};
