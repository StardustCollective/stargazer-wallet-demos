import React, {useEffect, useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper, Collapse, Select} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useStargazerProviders} from 'src/utils';

import styles from './index.module.scss';
import {
  AVALANCHE_CHAINS,
  AVALANCHE_TESTNET,
  BSC_CHAINS,
  BSC_TESTNET,
  CHAINS_MAP,
  ETHEREUM_CHAINS,
  ETHEREUM_TESTNET,
  EVM_CHAINS,
  POLYGON_CHAINS,
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
  const [selectedChain, setSelectedChain] = useState(STARGAZER_CHAINS.ETHEREUM);
  const [dagChainId, setDagChainId] = useState(0);

  const expectedChains = CHAINS_MAP[selectedChain];

  const isDAGdemo = title.includes('DAG');

  const stargazerProviders = useStargazerProviders();

  const onChainChanged = (chainId: string) => {
    setChainId(chainId);
  };

  const onDagChainChanged = (dagChainId: string) => {
    const dagChainIdNumber = parseInt(dagChainId, 16);
    setDagChainId(dagChainIdNumber);
  };

  useEffect(() => {
    if (stargazerProviders.connected) {
      if (!stargazerProviders.ethProvider) {
        return;
      }

      stargazerProviders.ethProvider.on('chainChanged', onChainChanged);

      if (!stargazerProviders.dagProvider) {
        return;
      }

      stargazerProviders.dagProvider.on('chainChanged', onDagChainChanged);
    }

    return () => {
      if (stargazerProviders.ethProvider && stargazerProviders.dagProvider) {
        stargazerProviders.ethProvider.removeListener('chainChanged', onChainChanged);
        stargazerProviders.dagProvider.removeListener('chainChanged', onDagChainChanged);
      }
    };
  }, [
    stargazerProviders.connected,
    stargazerProviders.ethProvider,
    stargazerProviders.dagProvider
  ]);

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
  }, [
    stargazerProviders.connected,
    stargazerProviders.ethProvider,
    stargazerProviders.dagProvider,
    selectedChain
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
                value={selectedChain}
                data={[
                  {label: 'Ethereum', value: STARGAZER_CHAINS.ETHEREUM},
                  {label: 'Polygon', value: STARGAZER_CHAINS.POLYGON},
                  {label: 'Binance Smart Chain', value: STARGAZER_CHAINS.BSC},
                  {label: 'Avalanche', value: STARGAZER_CHAINS.AVALANCHE}
                ]}
                onChange={(value) => setSelectedChain(value as STARGAZER_CHAINS)}
              />
            </Stack>
          )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.ETHEREUM &&
            chainId !== '0x0' &&
            ETHEREUM_CHAINS.includes(chainId) &&
            chainId !== ETHEREUM_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Goerli network, your wallet needs to be on the same
                network for executing them. On Stargazer {'>'} Network selector {'>'} Goerli
                Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.POLYGON &&
            chainId !== '0x0' &&
            POLYGON_CHAINS.includes(chainId) &&
            chainId !== POLYGON_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Polygon Testnet network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Network selector {'>'}{' '}
                Polygon Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.BSC &&
            chainId !== '0x0' &&
            BSC_CHAINS.includes(chainId) &&
            chainId !== BSC_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the BSC Testnet network, your wallet needs to be on the
                same network for executing them. On Stargazer {'>'} Network selector {'>'} BSC
                Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.AVALANCHE &&
            chainId !== '0x0' &&
            AVALANCHE_CHAINS.includes(chainId) &&
            chainId !== AVALANCHE_TESTNET && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Avalanche Fuji Testnet network, your wallet needs to
                be on the same network for executing them. On Stargazer {'>'} Network selector {'>'}{' '}
                Fuji Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            chainId !== '0x0' &&
            EVM_CHAINS.includes(selectedChain) &&
            !expectedChains.includes(chainId) && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                Please check if the Stargazer Wallet is connected to the current EVM network.
              </Alert>
            )}
          {walletRequired && isDAGdemo && dagChainId !== 0 && dagChainId !== 3 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Testnet 2.0 network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Network selector {'>'} Testnet
              2.0.
            </Alert>
          )}
          <Button
            disabled={
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.ETHEREUM &&
                chainId !== ETHEREUM_TESTNET) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.POLYGON &&
                chainId !== POLYGON_TESTNET) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.BSC &&
                chainId !== BSC_TESTNET) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.AVALANCHE &&
                chainId !== AVALANCHE_TESTNET) ||
              (walletRequired && isDAGdemo && dagChainId !== 3) ||
              (walletRequired && !stargazerProviders.connected) ||
              isLoading ||
              stargazerProviders.loading
            }
            onClick={() => onActionButtonClick(selectedChain)}
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
