import React, {useState} from 'react';
import {Title, Stack, Button, Alert, Loader, Center, Paper, Collapse} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';

import {useWeb3React} from 'src/utils';

import styles from './index.module.scss';

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
  const [open, setOpen] = useState(false);

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
          {walletRequired && typeof chainId === 'number' && chainId !== 5 && (
            <Alert icon={<AlertCircle size={16} />} title="Unsupported Chain" color="yellow">
              All demos were designed on the Goerli network, your wallet needs to be on the same
              network for executing them. On Stargazer {'>'} Settings {'>'} Networks {'>'} Ethereum
              Network {'>:'} and choose Goerli Testnet.
            </Alert>
          )}
          {walletRequired && !account && (
            <Alert icon={<AlertCircle size={16} />} title="Missing wallet" color="yellow">
              Connect your wallet to use this demo.
            </Alert>
          )}
          <Button
            disabled={
              (walletRequired && chainId !== 5) || (walletRequired && !account) || isLoading
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
