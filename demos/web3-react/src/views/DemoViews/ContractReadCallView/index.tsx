import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';
import {
  CHAIN_ID_TO_PROVIDER,
  STARGAZER_GREETER_ADDRESSES,
  STARGAZER_GREETER_STRING
} from 'src/common/consts/constants';

const ContractReadCallView = () => {
  const {library, chainId} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [greeting, setGreeting] = useState('');

  const doReadCall = async () => {
    setLoading(true);
    setError('');
    setGreeting('');

    if (library === undefined) {
      setError('Unable to get library provider (ethers.js)');
      return;
    }

    try {
      const provider = CHAIN_ID_TO_PROVIDER[chainId!];
      const StargazerGreeterAddress = STARGAZER_GREETER_ADDRESSES[provider];

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
