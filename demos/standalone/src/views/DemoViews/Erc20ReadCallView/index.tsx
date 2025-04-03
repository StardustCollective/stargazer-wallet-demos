import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {
  STARGAZER_CHAINS,
  STARGAZER_SAMPLE_TOKEN_ADDRESSES,
  STARGAZER_TOKEN_STRING
} from 'src/utils/constants';

const Erc20ReadCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [decimals, setDecimals] = useState('');

  const doReadCall = async (selectedChain: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider} = await stargazerProviders.connect();

      const StargazerTokenAddress: string = STARGAZER_SAMPLE_TOKEN_ADDRESSES[selectedChain];

      const library = new ethers.providers.Web3Provider(ethProvider, 'any');

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
      title="EVM - Read Call (ERC-20)"
      codeExample={demoCodeText}
      actionButtonClickContent="Send Read Call"
      onActionButtonClick={doReadCall}
      onWalletConnected={stargazerProviders.connect}
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
