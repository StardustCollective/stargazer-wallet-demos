import React, {useEffect, useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper, Collapse, Select} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useStargazerProviders} from 'src/utils';

import styles from './index.module.scss';
import {STARGAZER_CHAINS} from 'src/utils/constants';

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
    stargazerProviders.polygonProvider,
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
                  {label: 'Polygon', value: STARGAZER_CHAINS.POLYGON}
                ]}
                onChange={(value) => setSelectedProvider(value as STARGAZER_CHAINS)}
              />
            </Stack>
          )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.ETHEREUM &&
            chainId !== '0x0' &&
            chainId !== '0x5' && (
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
            polygonChainId !== '0x13881' && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Maticmum Testnet network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Settings {'>'} Networks{' '}
                {'>'} Polygon Network {'>'} and choose Maticmum Testnet.
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
                chainId !== '0x5') ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.POLYGON &&
                polygonChainId !== '0x13881') ||
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
