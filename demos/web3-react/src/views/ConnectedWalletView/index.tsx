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
  Loader,
  Select
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {StargazerConnector} from '@stardust-collective/web3-react-stargazer-connector';

import {useWeb3React} from 'src/utils/web3-react';
import useDagChainId from 'src/utils/useDagChainId';
import {stargazerConnector} from 'src/common/consts';

import styles from './index.module.scss';
import {STARGAZER_CHAINS} from 'src/common/consts/constants';
import {Chains} from '@stardust-collective/web3-react-stargazer-connector/dist/types/stargazer-types';

const CHAIN_NAMES = {
  1: 'Ethereum Mainnet',
  5: 'Ethereum Goerli Testnet',
  137: 'Polygon Mainnet',
  80001: 'Polygon Testnet',
  56: 'BSC Mainnet',
  97: 'BSC Testnet',
  43114: 'Avalanche C-Chain',
  43113: 'Avalanche Fuji Testnet'
};

const SUPPORTED_CHAINS = {
  5: 'Ethereum Goerli Testnet',
  80001: 'Polygon Testnet',
  97: 'BSC Testnet',
  43113: 'Avalanche Fuji Testnet'
};

const DAG_CHAIN_NAMES = {
  1: 'Constellation Mainnet 2.0',
  3: 'Constellation Testnet 2.0'
};

const ConnectedWalletView = () => {
  const {activate, account, chainId, connector} = useWeb3React();
  const {dagChainId} = useDagChainId();

  const [selectedProvider, setSelectedProvider] = useState(STARGAZER_CHAINS.ETHEREUM);
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

  const switchProvider = async (value: string) => {
    if (connector instanceof StargazerConnector) {
      await connector.switchEVMProvider(value as Chains);
      setSelectedProvider(value as STARGAZER_CHAINS);
    }
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
        {account && chainId && (
          <Center>
            <Badge
              variant="light"
              color={
                Object.keys(SUPPORTED_CHAINS).includes(chainId.toString()) ? 'green' : 'yellow'
              }
            >
              {CHAIN_NAMES[chainId] ?? 'Unknown Chain Id'}
            </Badge>
          </Center>
        )}
        {account &&
          selectedProvider === STARGAZER_CHAINS.ETHEREUM &&
          typeof chainId === 'number' &&
          chainId !== 5 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Goerli network, your wallet needs to be on the same
              network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'} Ethereum
              Network {'>'} and choose Goerli Testnet.
            </Alert>
          )}
        {account &&
          selectedProvider === STARGAZER_CHAINS.POLYGON &&
          typeof chainId === 'number' &&
          chainId !== 80001 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Polygon Testnet network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
              Polygon Network {'>'} and choose Polygon Testnet.
            </Alert>
          )}
        {account &&
          selectedProvider === STARGAZER_CHAINS.BSC &&
          typeof chainId === 'number' &&
          chainId !== 97 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the BSC Testnet network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'} BSC
              Network {'>'} and choose BSC Testnet.
            </Alert>
          )}
        {account &&
          selectedProvider === STARGAZER_CHAINS.AVALANCHE &&
          typeof chainId === 'number' &&
          chainId !== 43113 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Avalanche Fuji network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
              Avalanche Network {'>'} and choose Fuji Testnet.
            </Alert>
          )}
        {account && dagChainId && (
          <Center>
            <Badge variant="light" color={dagChainId === 3 ? 'green' : 'yellow'}>
              {DAG_CHAIN_NAMES[dagChainId] ?? 'Unknown Chain Id'}
            </Badge>
          </Center>
        )}
        {account && typeof dagChainId === 'number' && dagChainId !== 3 && (
          <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
            All demos were designed on the Testnet 2.0 network, your wallet needs to be on the same
            network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'> '}
            Constellation Network {'>'} and choose Testnet 2.0.
          </Alert>
        )}
        {account && (
          <Stack>
            <Select
              label={'Select EVM network'}
              value={selectedProvider}
              data={[
                {label: 'Ethereum', value: STARGAZER_CHAINS.ETHEREUM},
                {label: 'Polygon', value: STARGAZER_CHAINS.POLYGON},
                {label: 'Binance Smart Chain', value: STARGAZER_CHAINS.BSC},
                {label: 'Avalanche', value: STARGAZER_CHAINS.AVALANCHE}
              ]}
              onChange={switchProvider}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export {ConnectedWalletView};
