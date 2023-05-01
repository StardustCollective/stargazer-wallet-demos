import React, {useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper, Collapse} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useWeb3React} from 'src/utils';
import useDagChainId from 'src/utils/useDagChainId';

import styles from './index.module.scss';
import {STARGAZER_CHAINS} from 'src/common/consts/constants';

const DemoCard = ({
  title,
  codeExample,
  actionButtonClickContent,
  onActionButtonClick,
  walletRequired = false,
  isLoading = false,
  inputs = null,
  outputs = null,
  error = ''
}: {
  title: string;
  codeExample: string;
  onActionButtonClick: () => void;
  actionButtonClickContent: string;
  walletRequired?: boolean;
  isLoading?: boolean;
  inputs?: React.ReactNode;
  outputs?: React.ReactNode;
  error?: string;
}) => {
  const {account, chainId} = useWeb3React();
  const {dagChainId} = useDagChainId();
  const [open, setOpen] = useState(false);

  const isDAGdemo = title.includes('DAG');

  const CHAIN_ID_TO_PROVIDER = {
    1: STARGAZER_CHAINS.ETHEREUM,
    5: STARGAZER_CHAINS.ETHEREUM,
    137: STARGAZER_CHAINS.POLYGON,
    80001: STARGAZER_CHAINS.POLYGON,
    56: STARGAZER_CHAINS.BSC,
    97: STARGAZER_CHAINS.BSC,
    43114: STARGAZER_CHAINS.AVALANCHE,
    43113: STARGAZER_CHAINS.AVALANCHE
  };

  const selectedProvider: STARGAZER_CHAINS = CHAIN_ID_TO_PROVIDER[chainId!];

  return (
    <Paper shadow="xs" className={styles.main}>
      <Title order={2} onClick={() => setOpen((s) => !s)} sx={{cursor: 'pointer'}}>
        {title}
      </Title>
      <Collapse in={open} transitionDuration={500}>
        <Stack sx={{position: 'relative'}}>
          <Prism language="tsx">{codeExample}</Prism>
          {error && (
            <Alert icon={<AlertCircle size={16} />} title="Ohh no!" color="red">
              {error}
            </Alert>
          )}
          {isLoading && (
            <Center>
              <Loader />
            </Center>
          )}
          {inputs}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.ETHEREUM &&
            typeof chainId === 'number' &&
            chainId !== 5 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Goerli network, your wallet needs to be on the same
                network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
                Ethereum Network {'>:'} and choose Goerli Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.POLYGON &&
            typeof chainId === 'number' &&
            chainId !== 80001 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Polygon Testnet network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Settings {'>'} Networks{' '}
                {'>'} Polygon Network {'>'} and choose Polygon Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.BSC &&
            typeof chainId === 'number' &&
            chainId !== 97 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the BSC Testnet network, your wallet needs to be on the
                same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'}{' '}
                BSC Network {'>'} and choose BSC Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedProvider === STARGAZER_CHAINS.AVALANCHE &&
            typeof chainId === 'number' &&
            chainId !== 43113 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Avalanche Fuji network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Settings {'>'} Networks{' '}
                {'>'} Avalanche Network {'>'} and choose Fuji Testnet.
              </Alert>
            )}
          {walletRequired && isDAGdemo && typeof dagChainId === 'number' && dagChainId !== 3 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Testnet 2.0 network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'> '}
              Constellation Network {'>'} and choose Testnet 2.0.
            </Alert>
          )}
          {walletRequired && !account && (
            <Alert icon={<AlertCircle size={16} />} title="Missing wallet" color="yellow">
              Connect your wallet to use this demo.
            </Alert>
          )}
          <Button
            disabled={
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.ETHEREUM &&
                chainId !== 5) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.POLYGON &&
                chainId !== 80001) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.BSC &&
                chainId !== 97) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedProvider === STARGAZER_CHAINS.AVALANCHE &&
                chainId !== 43113) ||
              (walletRequired && isDAGdemo && dagChainId !== 3) ||
              (walletRequired && !account) ||
              isLoading
            }
            onClick={onActionButtonClick}
          >
            {actionButtonClickContent}
          </Button>
          {outputs}
        </Stack>
      </Collapse>
    </Paper>
  );
};

export {DemoCard};
