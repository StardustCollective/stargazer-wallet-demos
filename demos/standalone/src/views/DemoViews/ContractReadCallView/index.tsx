import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS} from 'src/utils/constants';

const ContractReadCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [greeting, setGreeting] = useState('');

  const doReadCall = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider, polygonProvider} = await stargazerProviders.connect();

      const PROVIDERS = {
        [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
        [STARGAZER_CHAINS.POLYGON]: polygonProvider
      };

      const provider: StargazerEIPProvider = PROVIDERS[selectedProvider];

      const library = new ethers.providers.Web3Provider(provider, 'any');

      const CONTRACT_ADDRESSES = {
        [STARGAZER_CHAINS.ETHEREUM]: '0x0F1568746563F6F1A01C76B7cfca4390d81D97b2',
        [STARGAZER_CHAINS.POLYGON]: '0xce4E723904f5a679eACB9D70710210024F62378C'
      };

      const StargazerGreeterAddress: string = CONTRACT_ADDRESSES[selectedProvider];

      const contract = new ethers.Contract(
        StargazerGreeterAddress,
        StargazerGreeterABI,
        library
      ) as unknown as StargazerGreeter;

      const greeting = await contract.greet();

      setGreeting(greeting);
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
      title="Smart Contract - Read Call"
      codeExample={demoCodeText}
      actionButtonClickContent="Send Read Call"
      onActionButtonClick={doReadCall}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Ethereum Smart Contract (Stargazer Greeter)"
            value="0x0F1568746563F6F1A01C76B7cfca4390d81D97b2"
            readOnly
            disabled
          />
          <Textarea
            label="Polygon Smart Contract (Stargazer Greeter)"
            value="0xce4E723904f5a679eACB9D70710210024F62378C"
            readOnly
            disabled
          />
        </>
      }
      outputs={<>{greeting && <Textarea label="Greeting" readOnly value={greeting}></Textarea>}</>}
    />
  );
};

export {ContractReadCallView};
export default ContractReadCallView;
