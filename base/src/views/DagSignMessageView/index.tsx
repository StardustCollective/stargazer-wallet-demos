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
  JsonInput
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';
import {StargazerConnector} from 'stargazer-connector';

import {useWeb3React} from 'src/utils';
import {BaseColor} from 'src/common/consts';

import signMessageText from './signMessage.text.ts';
import styles from './index.module.scss';

const DagSignMessageView = () => {
  const {account, connector} = useWeb3React();

  const [value, setValue] = useState(
    'Sign this message to confirm your participation in this project.'
  );
  const [metadata, setMetadata] = useState(
    JSON.stringify({field1: 'some-value', field2: 'another value'})
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const doSignMessage = async () => {
    let metadataValue: any;
    try {
      metadataValue = JSON.parse(metadata);
    } catch (e) {
      setError('You have to provide a valid JSON object as metadata');
      return;
    }

    setLoading(true);
    try {
      if (connector instanceof StargazerConnector) {
        const signatureRequest = {
          content: value,
          metadata: metadataValue
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
        <JsonInput
          label="Your metadata"
          placeholder="A cool message to sign"
          value={metadata}
          onChange={setMetadata}
        ></JsonInput>
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
