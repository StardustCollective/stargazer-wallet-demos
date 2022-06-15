import {useState} from 'react';
import {Textarea} from '@mantine/core';
import * as ethers from 'ethers';

import {DemoCard} from 'src/common/components';
import {useWeb3React} from 'src/utils';
import {ERC20ABI, ERC20} from 'src/utils/interfaces/ERC20';

import demoCodeText from './demoCode.text.ts';

const Erc20ReadCallView = () => {
  const {library} = useWeb3React();

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
            label="ERC20 Contract (Stargazer Token)"
            value="0x6235bFcC2eb5401932A03e043C9b7De4eDCe7A2f"
            readOnly
            disabled
          ></Textarea>
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
