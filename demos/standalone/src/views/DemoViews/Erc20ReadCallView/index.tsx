import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS} from 'src/utils/constants';

const Erc20ReadCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [decimals, setDecimals] = useState('');

  const doReadCall = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider, polygonProvider} = await stargazerProviders.connect();

      const PROVIDERS = {
        [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
        [STARGAZER_CHAINS.POLYGON]: polygonProvider
      };

      const CONTRACT_ADDRESSES = {
        [STARGAZER_CHAINS.ETHEREUM]: '0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65',
        [STARGAZER_CHAINS.POLYGON]: '0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5'
      };

      const StargazerTokenAddress: string = CONTRACT_ADDRESSES[selectedProvider];
      const provider: StargazerEIPProvider = PROVIDERS[selectedProvider];

      const library = new ethers.providers.Web3Provider(provider, 'any');

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
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Ethereum ERC20 Contract (Stargazer Token)"
            value="0x4FD968a301F07dB5Dd22f4f33c0B7f4D0b91AC65"
            readOnly
            disabled
          />
          <Textarea
            label="Polygon ERC20 Contract (Stargazer Token)"
            value="0x9994a07DD7Aa25388B3A73151EDfAf6B3d8d06D5"
            readOnly
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
