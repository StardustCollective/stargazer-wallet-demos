import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {StargazerGreeterABI, StargazerGreeter} from 'src/utils/interfaces/StargazerGreeter';

import demoCodeText from './demoCode.text.ts';

const ContractReadCallView = () => {
  const {library} = useWeb3React();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [greeting, setGreeting] = useState('');

  const doReadCall = async () => {
    setLoading(true);

    if (library === undefined) {
      setError('Unable to get library provider (ethers.js)');
      return;
    }

    try {
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
