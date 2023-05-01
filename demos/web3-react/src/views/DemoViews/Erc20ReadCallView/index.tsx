import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {
  CHAIN_ID_TO_PROVIDER,
  STARGAZER_SAMPLE_TOKEN_ADDRESSES,
  STARGAZER_TOKEN_STRING
} from 'src/common/consts/constants';

const Erc20ReadCallView = () => {
  const {library, chainId} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [decimals, setDecimals] = useState('');

  const doReadCall = async () => {
    setLoading(true);
    setError('');
    setDecimals('');

    try {
      const provider = CHAIN_ID_TO_PROVIDER[chainId!];
      const StargazerTokenAddress = STARGAZER_SAMPLE_TOKEN_ADDRESSES[provider];

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
    <DemoCard
      walletRequired
      title="ERC20 - Read Call"
      codeExample={demoCodeText}
      actionButtonClickContent="Send Read Call"
      onActionButtonClick={doReadCall}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Smart Contract Address (Stargazer Token)"
            value={STARGAZER_TOKEN_STRING}
            readOnly
            minRows={5}
            disabled
          />
        </>
      }
      outputs={
        <>
          {decimals && (
            <>
              <Textarea label="ERC20 decimals()" value={decimals}></Textarea>
            </>
          )}
        </>
      }
    />
  );
};

export {Erc20ReadCallView};
export default Erc20ReadCallView;
