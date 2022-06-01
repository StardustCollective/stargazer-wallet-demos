import {useState} from 'react';
import {
  Alert,
  Title,
  Badge,
  Center,
  Stack,
  Accordion,
  Kbd,
  Paper,
  Button,
  Loader
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {StargazerConnector} from 'stargazer-connector';

import {useWeb3React} from 'src/utils/web3-react';
import {stargazerConnector} from 'src/common/consts';

import styles from './index.module.scss';

const ConnectedWalletView = () => {
  const {activate, account, connector} = useWeb3React();

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
      <Stack spacing="sm">
        <Title order={2}>Connected Wallet</Title>
        {!account && (
          <Alert icon={<AlertCircle size={16} />} title="Info" color="blue">
            No connected wallet
          </Alert>
        )}
        {loading && (
          <Center>
            <Loader />
          </Center>
        )}
        {error && (
          <Alert icon={<AlertCircle size={16} />} title="Ohh no!" color="red">
            {error}
          </Alert>
        )}
        {!account && <Button onClick={doActivate}>Connect Wallet</Button>}
        {account && (
          <Center>
            <Badge variant="light" color="blue">
              {account}
            </Badge>
          </Center>
        )}
        {connector instanceof StargazerConnector && (
          <Accordion>
            <Accordion.Item label="$DAG Accounts">
              <Stack>
                {connector.dagAccounts.map((account) => (
                  <Kbd key={account}>{account}</Kbd>
                ))}
              </Stack>
            </Accordion.Item>
            <Accordion.Item label="ETH Accounts">
              <Stack>
                {connector.ethAccounts.map((account) => (
                  <Kbd key={account}>{account}</Kbd>
                ))}
              </Stack>
            </Accordion.Item>
          </Accordion>
        )}
      </Stack>
    </Paper>
  );
};

export {ConnectedWalletView};
