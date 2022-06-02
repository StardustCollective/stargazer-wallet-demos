import {useState} from 'react';
import {
  Title,
  Stack,
  Button,
  Alert,
  Loader,
  Center,
  Paper,
  LoadingOverlay,
  Text,
  Textarea
} from '@mantine/core';
import {AlertCircle} from 'tabler-icons-react';
import {Prism} from '@mantine/prism';
import * as ethers from 'ethers';

import {useWeb3React} from 'src/utils';
import {BaseColor} from 'src/common/consts';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import readCallText from './readCall.text.ts';
import styles from './index.module.scss';

const Erc20ReadCallView = () => {
  const {account, library} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decimals, setDecimals] = useState('');

  const doReadCall = async () => {
    setLoading(true);
    try {
      const StargazerTokenAddress = '0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f';

      const contract = new ethers.Contract(
        StargazerTokenAddress,
        ERC20ABI,
        library
      ) as unknown as ERC20;

      const decimals = await contract.decimals();
      setDecimals(String(decimals));
      setError('');
    } catch (e) {
      setError(String(e));
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <Paper shadow="xs" className={styles.main}>
      <Title order={2}>ERC20 - Read Call</Title>
      <Stack sx={{position: 'relative'}}>
        <LoadingOverlay
          color={BaseColor.WHITE}
          visible={!account}
          loader={<Text>Connect your wallet to use this demo</Text>}
        />
        <Prism language="tsx">{readCallText}</Prism>
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
        <Textarea
          label="ERC20 Contract (Stargazer Token)"
          value="0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f"
          readOnly
          disabled
        ></Textarea>
        <Button onClick={doReadCall}>Send Read Call</Button>
        {decimals && (
          <>
            <Textarea label="ERC20 decimals()" value={decimals}></Textarea>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export {Erc20ReadCallView};
