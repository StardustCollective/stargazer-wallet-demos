import React, {useContext, useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper, Collapse} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useWeb3React} from 'src/utils';
import useDagChainId from 'src/utils/useDagChainId';

import styles from './index.module.scss';
import {CHAINS_MAP, EVM_CHAINS, STARGAZER_CHAINS} from 'src/common/consts/constants';
import {NetworkContext} from 'src/App';

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
  const {selectedChain} = useContext(NetworkContext);
  const [open, setOpen] = useState(false);

  const isDAGdemo = title.includes('DAG');

  const expectedChains = CHAINS_MAP[selectedChain];

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
            selectedChain === STARGAZER_CHAINS.ETHEREUM &&
            typeof chainId === 'number' &&
            expectedChains.includes(chainId) &&
            chainId !== 5 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Goerli network, your wallet needs to be on the same
                network for executing them. On Stargazer {'>'} Network selector {'>'} Goerli
                Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.POLYGON &&
            typeof chainId === 'number' &&
            expectedChains.includes(chainId) &&
            chainId !== 80001 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Polygon Testnet network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Network selector {'>'}{' '}
                Polygon Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.BSC &&
            typeof chainId === 'number' &&
            expectedChains.includes(chainId) &&
            chainId !== 97 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the BSC Testnet network, your wallet needs to be on the
                same network for executing them. On Stargazer {'>'} Network selector {'>'} BSC
                Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            selectedChain === STARGAZER_CHAINS.AVALANCHE &&
            typeof chainId === 'number' &&
            expectedChains.includes(chainId) &&
            chainId !== 43113 && (
              <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
                All demos were designed on the Avalanche Fuji network, your wallet needs to be on
                the same network for executing them. On Stargazer {'>'} Network selector {'>'} Fuji
                Testnet.
              </Alert>
            )}
          {walletRequired &&
            !isDAGdemo &&
            EVM_CHAINS.includes(selectedChain) &&
            typeof chainId === 'number' &&
            !expectedChains.includes(chainId) && (
              <Alert icon={<AlertCircle size={16} />} title="Wrong Network" color="yellow">
                Please check if the Stargazer Wallet is connected to the current EVM network.
              </Alert>
            )}
          {walletRequired && isDAGdemo && typeof dagChainId === 'number' && dagChainId !== 3 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Testnet 2.0 network, your wallet needs to be on the
              same network for executing them. On Stargazer {'>'} Network selector {'>'} Testnet
              2.0.
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
                selectedChain === STARGAZER_CHAINS.ETHEREUM &&
                chainId !== 5) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.POLYGON &&
                chainId !== 80001) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.BSC &&
                chainId !== 97) ||
              (walletRequired &&
                !isDAGdemo &&
                selectedChain === STARGAZER_CHAINS.AVALANCHE &&
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
