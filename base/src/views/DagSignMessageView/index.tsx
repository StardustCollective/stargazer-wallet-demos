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
import {BaseColor} from '@/src/common/consts';

import signMessageText from './signMessage.text.ts';
import styles from './index.module.scss';

const DagSignMessageView = () => {
  const {account, connector} = useWeb3React();

  const [value, setValue] = useState(
    "Sign this message to confirm your participation in this month's program."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const doSignMessage = async () => {
    setLoading(true);
    try {
      if (connector instanceof StargazerConnector) {
        const signatureRequest = {
          content: value,
          metadata: {
            projectId: '3feb69d6-d3f0-4812-9c93-384bee08afe8',
            nodes: 24,
            fee: 0
          }
        };

        const signatureRequestEnconded = window.btoa(JSON.stringify(signatureRequest));

        const userAddress = connector.dagAccounts[0];

        const signature = await connector.dagProvider.request({
          method: 'dag_signMessage',
          params: [userAddress, signatureRequestEnconded]
        });

        const publicKey = await connector.dagProvider.request({
          method: 'dag_getPublicKey',
          params: [userAddress]
        });

        setSignature(signature);
        setPublicKey(publicKey);
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
      <Title order={2}>$DAG - Sign Message</Title>
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
        {signature && publicKey && (
          <>
            <Textarea label="Signature" value={signature}></Textarea>
            <Textarea label="Public Key" value={publicKey}></Textarea>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export {DagSignMessageView};
