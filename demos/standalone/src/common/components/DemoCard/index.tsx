import React, {useEffect, useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper, Collapse, Select} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useStargazerProviders} from 'src/utils';

import styles from './index.module.scss';
import {
  AVALANCHE_TESTNET,
  BSC_TESTNET,
  ETHEREUM_TESTNET,
  POLYGON_TESTNET,
  STARGAZER_CHAINS
} from 'src/utils/constants';

const DemoCard = ({
  title,
  codeExample,
  actionButtonClickContent,
  onActionButtonClick,
  onWalletConnected,
  walletRequired = false,
  isLoading = false,
  inputs = null,
  outputs = null,
  error = ''
}: {
  title: string;
  codeExample: string;
  onActionButtonClick: (provider: STARGAZER_CHAINS) => void;
  actionButtonClickContent: string;
  onWalletConnected?: () => void;
  walletRequired?: boolean;
  isLoading?: boolean;
  inputs?: React.ReactNode;
  outputs?: React.ReactNode;
  error?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [chainId, setChainId] = useState('0x0');
  const [polygonChainId, setPolygonChainId] = useState('0x0');
  const [bscChainId, setBscChainId] = useState('0x0');
  const [avalancheChainId, setAvalancheChainId] = useState('0x0');
  const [selectedProvider, setSelectedProvider] = useState(STARGAZER_CHAINS.ETHEREUM);
  const [dagChainId, setDagChainId] = useState(0);

  const isDAGdemo = title.includes('DAG');

  const stargazerProviders = useStargazerProviders();

  useEffect(() => {
    if (stargazerProviders.connected) {
      typeof onWalletConnected === 'function' && onWalletConnected();
      (async () => {
        if (!stargazerProviders.ethProvider) {
          return;
        }

        const chainId = await stargazerProviders.ethProvider.request({
          method: 'eth_chainId',
          params: []
        });
        setChainId(chainId);
      })();
      (async () => {
        if (!stargazerProviders.polygonProvider) {
          return;
        }

        const polygonChainId = await stargazerProviders.polygonProvider.request({
          method: 'eth_chainId',
          params: []
        });
        setPolygonChainId(polygonChainId);
      })();
      (async () => {
        if (!stargazerProviders.bscProvider) {
          return;
        }

        const bscChainId = await stargazerProviders.bscProvider.request({
          method: 'eth_chainId',
          params: []
        });
        setBscChainId(bscChainId);
      })();
      (async () => {
        if (!stargazerProviders.avalancheProvider) {
          return;
        }

        const avalancheChainId = await stargazerProviders.avalancheProvider.request({
          method: 'eth_chainId',
          params: []
        });
        setAvalancheChainId(avalancheChainId);
      })();
      (async () => {
        if (!stargazerProviders.dagProvider) {
          return;
        }

        const dagChainId = await stargazerProviders.dagProvider.request({
          method: 'dag_chainId',
          params: []
        });
        setDagChainId(dagChainId);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    stargazerProviders.connected,
    stargazerProviders.ethProvider,
    stargazerProviders.polygonProvider,
    stargazerProviders.bscProvider,
    stargazerProviders.avalancheProvider,
    stargazerProviders.dagProvider
  ]);

  return (
    <Paper shadow="xs" className={styles.main}>
      <Title order={2} onClick={() => setOpen((s) => !s)} sx={{cursor: 'pointer'}}>
        {title}
      </Title>
      <Collapse in={open} transitionDuration={500}>
        <Stack sx={{position: 'relative'}}>
          <Prism language="tsx">{codeExample}</Prism>
          {(stargazerProviders.error || error) && (
            <Alert icon={<AlertCircle size={16} />} title="Ohh no!" color="red">
              {stargazerProviders.error}
              {error}
            </Alert>
          )}
          {(stargazerProviders.loading || isLoading) && (
            <Center>
              <Loader />
            </Center>
          )}
          {inputs}
          {walletRequired && !isDAGdemo && stargazerProviders.connected && (
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
                onChange={(value) => setSelectedProvider(value as STARGAZER_CHAINS)}
              />
            </Stack>
          )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.ETHEREUM &&
            chainId !== '0x0' &&
            chainId !== ETHEREUM_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Goerli network, your wallet needs to be on the same
                network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
                Ethereum Network {'>'} and choose Goerli Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.POLYGON &&
            polygonChainId !== '0x0' &&
            polygonChainId !== POLYGON_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Maticmum Testnet network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Settings {'>'} Networks{' '}
                {'>'} Polygon Network {'>'} and choose Maticmum Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.BSC &&
            bscChainId !== '0x0' &&
            bscChainId !== BSC_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the BSC Testnet network, your wallet needs to be on the
                same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
                BSC Network {'>'} and choose BSC Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.AVALANCHE &&
            avalancheChainId !== '0x0' &&
            avalancheChainId !== AVALANCHE_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Avalanche Fuji Testnet network, your wallet needs to
                be on the same network for executing them. On Stargazer {'>'} Settings {'>'}{' '}
                Networks {'>'} Avalanche Network {'>'} and choose Fuji Testnet.
              </Alert>
            )}
          {walletRequired && isDAGdemo && dagChainId !== 0 && dagChainId !== 3 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Testnet 2.0 network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
              Constellation Network {'>'} and choose Testnet 2.0.
            </Alert>
          )}
          <Button
            disabled={
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.ETHEREUM &&
                chainId !== ETHEREUM_TESTNET) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.POLYGON &&
                polygonChainId !== POLYGON_TESTNET) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.BSC &&
                bscChainId !== BSC_TESTNET) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.AVALANCHE &&
                avalancheChainId !== AVALANCHE_TESTNET) ||
              (walletRequired && isDAGdemo && dagChainId !== 3) ||
              (walletRequired && !stargazerProviders.connected) ||
              isLoading ||
              stargazerProviders.loading
            }
            onClick={() => onActionButtonClick(selectedProvider)}
          >
            {actionButtonClickContent}
          </Button>
          {outputs}
        </Stack>

        {walletRequired && !stargazerProviders.connected && (
          <Stack sx={{position: 'relative', marginTop: '10px'}}>
            <Button disabled={stargazerProviders.loading} onClick={stargazerProviders.connect}>
              Connect your wallet
            </Button>
          </Stack>
        )}
      </Collapse>
    </Paper>
  );
};

export {DemoCard};
