import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';
import {
  STARGAZER_CHAINS,
  STARGAZER_GREETER_ADDRESSES,
  STARGAZER_GREETER_STRING
} from 'src/utils/constants';

const ContractReadCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [greeting, setGreeting] = useState('');

  const doReadCall = async (selectedProvider: STARGAZER_CHAINS) => {
    setLoading(true);

    try {
      const {ethProvider, polygonProvider, bscProvider, avalancheProvider} =
        await stargazerProviders.connect();

      const PROVIDERS = {
        [STARGAZER_CHAINS.ETHEREUM]: ethProvider,
        [STARGAZER_CHAINS.POLYGON]: polygonProvider,
        [STARGAZER_CHAINS.BSC]: bscProvider,
        [STARGAZER_CHAINS.AVALANCHE]: avalancheProvider
      };

      const provider: StargazerEIPProvider = PROVIDERS[selectedProvider];

      const library = new ethers.providers.Web3Provider(provider, 'any');

      const StargazerGreeterAddress: string = STARGAZER_GREETER_ADDRESSES[selectedProvider];

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
            label="Smart Contract Address (Stargazer Greeter)"
            value={STARGAZER_GREETER_STRING}
            readOnly
            minRows={5}
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
