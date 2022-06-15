import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';

const ContractReadCallView = () => {
  const stargazerProviders = useStargazerProviders();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [greeting, setGreeting] = useState('');

  const doReadCall = async () => {
    setLoading(true);

    try {
      const {ethProvider} = await stargazerProviders.connect();

      const library = new ethers.providers.Web3Provider(ethProvider, 'any');

      const StargazerGreeterAddress = '0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4';

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
            label="Smart Contract (Stargazer Greeter)"
            value="0x1DBF94D57ceb7b59de0b5efd1e85776aa97CbDb4"
            readOnly
            disabled
          ></Textarea>
        </>
      }
      outputs={<>{greeting && <Textarea label="Greeting" readOnly value={greeting}></Textarea>}</>}
    />
  );
};

export {ContractReadCallView};
export default ContractReadCallView;
