import {useContext, useState} from 'react';
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
import {StargazerWeb3ReactConnector} from '@stardust-collective/web3-react-stargazer-connector';
import {useWeb3React} from 'src/utils/web3-react';
import useDagChainId from 'src/utils/useDagChainId';
import {BaseColor, stargazerConnector} from 'src/common/consts';

import styles from './index.module.scss';
import {
  CHAINS_MAP,
  EVM_CHAINS,
  HEX_CHAINS_MAP,
  STARGAZER_CHAINS
} from 'src/common/consts/constants';
import {NetworkContext} from 'src/App';

const CHAIN_NAMES = {
  1: 'Ethereum Mainnet',
  5: 'Ethereum Goerli Testnet',
  11155111: 'Ethereum Sepolia Testnet',
  137: 'Polygon Mainnet',
  80001: 'Polygon Testnet',
  56: 'BSC Mainnet',
  97: 'BSC Testnet',
  43114: 'Avalanche C-Chain',
  43113: 'Avalanche Fuji Testnet'
};

const SUPPORTED_CHAINS = {
  11155111: 'Ethereum Sepolia Testnet',
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
  const {selectedChain, setSelectedChain} = useContext(NetworkContext);
  const {dagChainId} = useDagChainId();

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

  const switchChain = async (value: string) => {
    setSelectedChain(value as STARGAZER_CHAINS);

    if (connector instanceof StargazerWeb3ReactConnector) {
      const hexChainId = HEX_CHAINS_MAP[value];
      await connector.ethProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{chainId: hexChainId}]
      });
    }
  };

  const expectedChains = CHAINS_MAP[selectedChain];

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
        {connector instanceof StargazerWeb3ReactConnector && (
          <Accordion>
            <Accordion.Item label="$DAG Accounts">
              <Stack>
                {connector.dagAccounts.map((account) => (
                  <Kbd key={account}>{account}</Kbd>
                ))}
              </Stack>
            </Accordion.Item>
            <Accordion.Item label="EVM Accounts">
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
                Object.keys(SUPPORTED_CHAINS).includes(chainId.toString()) &&
                expectedChains.includes(chainId)
                  ? 'green'
                  : 'yellow'
              }
            >
              {CHAIN_NAMES[chainId] ?? 'Unknown Chain Id'}
            </Badge>
          </Center>
        )}
        {account &&
          selectedChain === STARGAZER_CHAINS.ETHEREUM &&
          typeof chainId === 'number' &&
          expectedChains.includes(chainId) &&
          chainId !== 11155111 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Sepolia network, your wallet needs to be on the same
              network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'} Ethereum{' '}
              {'>'} Sepolia Testnet.
            </Alert>
          )}
        {account &&
          selectedChain === STARGAZER_CHAINS.POLYGON &&
          typeof chainId === 'number' &&
          expectedChains.includes(chainId) &&
          chainId !== 80001 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Polygon Testnet network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
              Polygon {'>'} Polygon Testnet.
            </Alert>
          )}
        {account &&
          selectedChain === STARGAZER_CHAINS.BSC &&
          typeof chainId === 'number' &&
          expectedChains.includes(chainId) &&
          chainId !== 97 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the BSC Testnet network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'} BNB{' '}
              Chain {'>'} BSC Testnet.
            </Alert>
          )}
        {account &&
          selectedChain === STARGAZER_CHAINS.AVALANCHE &&
          typeof chainId === 'number' &&
          expectedChains.includes(chainId) &&
          chainId !== 43113 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Avalanche Fuji network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
              Avalanche {'>'} Fuji Testnet.
            </Alert>
          )}
        {account &&
          EVM_CHAINS.includes(selectedChain) &&
          typeof chainId === 'number' &&
          !expectedChains.includes(chainId) && (
            <Alert icon={<AlertCircle size={16} />} title="Wrong Network" color="yellow">
              The Stargazer Wallet is connected to &quot;{CHAIN_NAMES[chainId]}&quot; but the
              selected EVM network is different.
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
            network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
            Constellation {'>'} Testnet 2.0.
          </Alert>
        )}
        {account && (
          <Stack>
            <Select
              label={'Select EVM network'}
              value={selectedChain}
              data={[
                {label: 'Ethereum', value: STARGAZER_CHAINS.ETHEREUM},
                {label: 'Polygon', value: STARGAZER_CHAINS.POLYGON},
                {label: 'Binance Smart Chain', value: STARGAZER_CHAINS.BSC},
                {label: 'Avalanche', value: STARGAZER_CHAINS.AVALANCHE}
              ]}
              onChange={switchChain}
              styles={() => ({
                selected: {
                  color: BaseColor.SOFT_IRIS
                }
              })}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export {ConnectedWalletView};
