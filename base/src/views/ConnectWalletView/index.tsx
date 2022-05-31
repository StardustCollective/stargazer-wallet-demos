import {useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useWeb3React} from '@/src/utils';
import {stargazerConnector} from '@/src/common/consts';

import connectWalletText from './connectWallet.text.ts';
import styles from './index.module.scss';

const ConnectWalletView = () => {
  const {activate} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const doActivate = async () => {
    setLoading(true);
    try {
      await activate(stargazerConnector, undefined, true);
    } catch (e) {
      if (e instanceof Error && /providers are not available/i.test(e.message)) {
        setError('Seems Stargazer is not installed or available');
      }
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Paper shadow="xs" className={styles.main}>
      <Title order={2}>Connect Wallet</Title>
      <Stack>
        <Prism language="tsx">{connectWalletText}</Prism>
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
        <Button onClick={doActivate}>Connect Wallet</Button>
      </Stack>
    </Paper>
  );
};

export {ConnectWalletView};
