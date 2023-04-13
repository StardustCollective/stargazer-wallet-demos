import {useState} from 'react';
import {Textarea} from '@mantine/core';

import {useStargazerProviders} from 'src/utils';
import {DemoCard} from 'src/common/components';

import demoCodeText from './demoCode.text.ts';
import {STARGAZER_CHAINS} from 'src/utils/constants';

const EthSignMessageView = () => {
  const stargazerProviders = useStargazerProviders();

  const [value, setValue] = useState(
    "Sign this message to confirm your participation in this month's program."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signature, setSignature] = useState('');

  const doSignMessage = async (selectedProvider: STARGAZER_CHAINS) => {
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

      const accounts = await provider.request({method: 'eth_accounts', params: []});

      // Build your message
      const message = "Sign this message to confirm your participation in this month's program.";

      const signature = await provider.request({
        method: 'personal_sign',
        params: [accounts[0], message]
      });

      setSignature(signature);
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
      title="EVM - Sign Message"
      codeExample={demoCodeText}
      actionButtonClickContent="Sign Message"
      onActionButtonClick={doSignMessage}
      onWalletConnected={stargazerProviders.connect}
      isLoading={loading}
      error={error}
      inputs={
        <>
          <Textarea
            label="Your message"
            placeholder="A cool message to sign"
            value={value}
            onChange={(event) => setValue(event.currentTarget.value)}
          ></Textarea>
        </>
      }
      outputs={<>{signature && <Textarea label="Signature" value={signature}></Textarea>}</>}
    />
  );
};

export {EthSignMessageView};
export default EthSignMessageView;
